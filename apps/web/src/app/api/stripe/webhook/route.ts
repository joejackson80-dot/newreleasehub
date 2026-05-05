import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type Stripe from 'stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
    }
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Webhook Error: ${msg}`);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const protocol = session.metadata?.protocol || 'INSTITUTIONAL_V2.4';

      // Handle One-time Bid Payments (Master Participation)
      const bidId = session.metadata?.bidId || session.client_reference_id;
      if (session.mode === 'payment' && bidId) {
        console.info(`[FORENSIC_AUDIT] Payment verified for bid: ${bidId} | Protocol: ${protocol}`);
        await prisma.bidOffer.update({ where: { id: bidId }, data: { status: 'ACCEPTED' } });

        const bid = await prisma.bidOffer.findUnique({
          where: { id: bidId },
          include: { MusicAsset: true }
        });

        if (bid?.musicAssetId) {
          await prisma.participationLicense.create({
            data: {
              organizationId: bid.organizationId,
              musicAssetId: bid.musicAssetId,
              userId: bid.userId,
              allocatedBps: bid.requestedBps,
              feeCents: bid.offerAmountCents,
              status: 'VERIFIED',
            }
          });
          await prisma.musicAsset.update({
            where: { id: bid.musicAssetId },
            data: { allocatedLicenseBps: { increment: bid.requestedBps } }
          });
          console.info(`[FORENSIC_AUDIT] Participation License minted for User ${bid.userId} on Asset ${bid.musicAssetId}`);
        }
      }

      // Handle Subscriptions
      const userId = session.metadata?.userId || session.client_reference_id;

      if (session.mode === 'subscription' && session.metadata?.type === 'SUPPORTER_SUBSCRIPTION' && userId) {
        console.info(`[FORENSIC_AUDIT] Supporter Subscription verified for user: ${userId} | Protocol: ${protocol}`);

        const artistId = session.metadata.artistId;
        const tierId = session.metadata.tierId;
        const tier = await prisma.supporterTier.findUnique({ where: { id: tierId } });

        if (tier) {
          try {
            await prisma.$transaction(async (tx) => {
              const updatedOrg = await tx.organization.update({
                where: { id: artistId },
                data: { supporterCount: { increment: 1 } },
                select: { supporterCount: true }
              });
              await tx.supporterSubscription.create({
                data: {
                  fanId: userId,
                  artistId,
                  tierId,
                  supporterNumber: updatedOrg.supporterCount,
                  priceCents: tier.priceCents,
                  revenueSharePercent: tier.revenueSharePercent,
                  status: 'ACTIVE',
                }
              });
              const { calculateMonthlyRoyalties } = await import('@/lib/private/royalties/calculateRoyalties');
              await calculateMonthlyRoyalties();
              console.info(`[FORENSIC_AUDIT] Automated royalty ledger update triggered by new supporter.`);
            });
          } catch (err: unknown) {
            console.error(`[FORENSIC_AUDIT_FAILURE] Royalty transaction failed`, err);
            return NextResponse.json({ error: 'Ledger update failed. Transaction rolled back.' }, { status: 500 });
          }
        }
      } else if (session.mode === 'subscription' && userId) {
        console.info(`[FORENSIC_AUDIT] Network Subscription verified for user: ${userId} | Protocol: ${protocol}`);
        await prisma.user.update({ where: { id: userId }, data: { subscriptionStatus: 'subscriber' } });
        await prisma.fanSubscription.create({
          data: {
            fanId: userId,
            status: 'active',
            monthlyAmountCents: session.amount_total || 999,
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
            startDate: new Date(),
          }
        });
        console.info(`[FORENSIC_AUDIT] User ${userId} upgraded to institutional participant status.`);
      }
      break;
    }
    default:
      console.info(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

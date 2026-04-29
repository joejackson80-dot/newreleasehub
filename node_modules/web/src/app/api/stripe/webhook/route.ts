import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');

  let event;

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
    }
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as any;
      const protocol = session.metadata?.protocol || 'INSTITUTIONAL_V2.4';
      
      // Handle One-time Bid Payments (Master Participation)
      const bidId = session.metadata?.bidId || session.client_reference_id;
      if (session.mode === 'payment' && bidId) {
        console.info(`[FORENSIC_AUDIT] Payment verified for bid: ${bidId} | Protocol: ${protocol}`);
        
        await prisma.bidOffer.update({
          where: { id: bidId },
          data: { status: 'ACCEPTED' }
        });

        const bid = await prisma.bidOffer.findUnique({
          where: { id: bidId },
          include: { MusicAsset: true }
        });

        if (bid && bid.musicAssetId) {
          await prisma.participationLicense.create({
            data: {
              organizationId: bid.organizationId,
              musicAssetId: bid.musicAssetId,
              userId: bid.userId,
              allocatedBps: bid.requestedBps,
              feeCents: bid.offerAmountCents,
              status: 'VERIFIED',
              // Note: We could store protocol in a notes field if schema allowed
            }
          });

          await prisma.musicAsset.update({
            where: { id: bid.musicAssetId },
            data: { allocatedLicenseBps: { increment: bid.requestedBps } }
          });
          
          console.info(`[FORENSIC_AUDIT] Participation License minted for User ${bid.userId} on Asset ${bid.musicAssetId}`);
        }
      }

      // Handle Subscriptions (Support-Tier Framework)
      const userId = session.metadata?.userId || session.client_reference_id;
      if (session.mode === 'subscription' && userId) {
        console.info(`[FORENSIC_AUDIT] Support-Tier Subscription verified for user: ${userId} | Protocol: ${protocol}`);
        
        await prisma.user.update({
          where: { id: userId },
          data: { subscriptionStatus: 'subscriber' }
        });

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

    default:
      console.info(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}



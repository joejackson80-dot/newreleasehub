import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
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

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const protocol = session.metadata?.protocol || 'INSTITUTIONAL_V2.4';

      // Handle One-time Bid Payments (Master Participation)
      const bidId = session.metadata?.bidId || session.client_reference_id;
      if (session.mode === 'payment' && bidId) {
        console.info(`[FORENSIC_AUDIT] Payment verified for bid: ${bidId} | Protocol: ${protocol}`);
        
        const { data: bid, error: bError } = await supabase
          .from('bid_offers')
          .update({ status: 'ACCEPTED' })
          .eq('id', bidId)
          .select('*, tracks(*)')
          .single();

        if (bError || !bid) {
          console.error('Error fetching bid after payment:', bError);
          break;
        }

        if (bid.track_id) {
          await supabase.from('participation_licenses').insert({
            organization_id: bid.organization_id,
            track_id: bid.track_id,
            user_id: bid.user_id,
            allocated_bps: bid.requested_bps,
            fee_cents: bid.offer_amount_cents,
            status: 'VERIFIED',
          });
          
          const track = Array.isArray(bid.tracks) ? bid.tracks[0] : bid.tracks;
          if (track) {
            await supabase.from('tracks').update({
              allocated_license_bps: (track.allocated_license_bps || 0) + bid.requested_bps
            }).eq('id', bid.track_id);
          }
          console.info(`[FORENSIC_AUDIT] Participation License minted for User ${bid.user_id} on Asset ${bid.track_id}`);
        }
      }

      // Handle Subscriptions
      const userId = session.metadata?.userId || session.client_reference_id;

      if (session.mode === 'subscription' && session.metadata?.type === 'SUPPORTER_SUBSCRIPTION' && userId) {
        console.info(`[FORENSIC_AUDIT] Supporter Subscription verified for user: ${userId} | Protocol: ${protocol}`);

        const artistId = session.metadata.artistId;
        const tierId = session.metadata.tierId;
        
        const { data: tier } = await supabase
          .from('supporter_tiers')
          .select('*')
          .eq('id', tierId)
          .single();

        if (tier) {
          try {
            // Update org supporter count
            const { data: org } = await supabase
              .from('organizations')
              .update({ supporter_count: (tier.supporter_count || 0) + 1 }) // This is a bit simplified without increment
              .eq('id', artistId)
              .select('supporter_count')
              .single();

            if (org) {
              await supabase.from('supporter_subscriptions').insert({
                fan_id: userId,
                artist_id: artistId,
                tier_id: tierId,
                supporter_number: org.supporter_count,
                price_cents: tier.price_cents,
                revenue_share_percent: tier.revenue_share_percent,
                status: 'ACTIVE',
              });
              
              const { calculateMonthlyRoyalties } = await import('@/lib/private/royalties/calculateRoyalties');
              await calculateMonthlyRoyalties();
              console.info(`[FORENSIC_AUDIT] Automated royalty ledger update triggered by new supporter.`);
            }
          } catch (err: unknown) {
            console.error(`[FORENSIC_AUDIT_FAILURE] Royalty processing failed`, err);
          }
        }
      } else if (session.mode === 'subscription' && userId) {
        console.info(`[FORENSIC_AUDIT] Network Subscription verified for user: ${userId} | Protocol: ${protocol}`);
        
        await supabase
          .from('users')
          .update({ subscription_status: 'subscriber' })
          .eq('id', userId);

        await supabase.from('fan_subscriptions').insert({
          fan_id: userId,
          status: 'active',
          monthly_amount_cents: session.amount_total || 999,
          stripe_subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
          start_date: new Date().toISOString(),
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

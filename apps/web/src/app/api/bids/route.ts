export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripeSession } from '@/lib/stripe';
import { sendNewSUPPORTEREmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    if (!orgId) throw new Error("orgId is required");

    const supabase = await createClient();
    const { data: bids, error } = await supabase
      .from('bid_offers')
      .select('*, tracks(*)')
      .eq('organization_id', orgId)
      .order('offer_amount_cents', { ascending: false });

    if (error) throw error;

    return NextResponse.json(bids);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { organizationId, musicAssetId, userId, offerAmountCents, requestedBps, note } = await req.json();
    
    const supabase = await createClient();

    // 1. Get Org and Stripe Account
    const { data: org, error: oError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .maybeSingle();

    if (oError || !org) throw new Error("Organization not found");
    if (!org.stripe_account_id) throw new Error("Artist has not connected a payout account yet.");

    // 2. Find the asset if not provided
    let targetAssetId = musicAssetId;
    if (!targetAssetId) {
      const { data: asset } = await supabase
        .from('tracks')
        .select('id')
        .eq('organization_id', organizationId)
        .limit(1)
        .maybeSingle();
      targetAssetId = asset?.id;
    }

    if (!targetAssetId) throw new Error("No music asset found to bid on");

    // 3. Create Pending Bid
    const { data: bid, error: bError } = await supabase
      .from('bid_offers')
      .insert({
        organization_id: organizationId,
        track_id: targetAssetId,
        user_id: userId || 'anonymous_fan',
        offer_amount_cents: parseInt(offerAmountCents),
        requested_bps: parseInt(requestedBps),
        note,
        status: 'PENDING'
      })
      .select()
      .single();

    if (bError || !bid) throw bError || new Error("Failed to create bid");

    // 4. Create Real Stripe Session
    const session = await getStripeSession(bid.id, bid.offer_amount_cents, org.stripe_account_id);

    return NextResponse.json({
      success: true,
      bid,
      checkoutUrl: session.url
    });
  } catch (error: unknown) {
    console.error('Bid POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const bidId = body.id || body.bidId;
    const status = body.status;
    
    if (!bidId || !status) throw new Error("id and status are required");

    const supabase = await createClient();

    const { data: bid, error: bError } = await supabase
      .from('bid_offers')
      .update({ status })
      .eq('id', bidId)
      .select('*, tracks(*)')
      .single();

    if (bError || !bid) throw bError || new Error("Bid not found");

    // If accepted, we trigger the participation_licenses creation
    if (status === 'ACCEPTED') {
      const [ { data: artist }, { data: fan } ] = await Promise.all([
        supabase.from('organizations').select('email, name').eq('id', bid.organization_id).single(),
        supabase.from('users').select('display_name').eq('id', bid.user_id).single()
      ]);

      await supabase.from('participation_licenses').insert({
        organization_id: bid.organization_id,
        track_id: bid.track_id,
        user_id: bid.user_id,
        allocated_bps: bid.requested_bps,
        fee_cents: bid.offer_amount_cents
      });
      
      // Update the asset's allocated basis points
      if (bid.track_id) {
        const track = Array.isArray(bid.tracks) ? bid.tracks[0] : bid.tracks;
        await supabase.from('tracks').update({
          allocated_license_bps: (track?.allocated_license_bps || 0) + bid.requested_bps
        }).eq('id', bid.track_id);
      }

      // Send Notification
      if (artist?.email) {
        sendNewSUPPORTEREmail({
          to: artist.email, 
          artistName: artist.name, 
          fanName: fan?.display_name || 'A Fan', 
          tierName: `Bid of $${(bid.offer_amount_cents / 100).toFixed(2)}`
        }).catch(err => console.error('Failed to send SUPPORTER email:', err));
      }
    }

    return NextResponse.json(bid);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

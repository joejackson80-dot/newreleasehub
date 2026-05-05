export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';

export async function GET() {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const supabase = await createClient();

    const { data: payoutRequests, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('organization_id', artist.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, payoutRequests });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Payouts GET error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { amountCents, method, destination } = await req.json();

    if (!amountCents || amountCents <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check balance
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('balance_cents')
      .eq('id', artist.id)
      .maybeSingle();

    if (orgError || !org) throw orgError || new Error("Organization not found");

    if (org.balance_cents < amountCents) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    // Create request and deduct balance (Supabase doesn't have multi-table transactions in the client, but we can do them sequentially or via RPC)
    // For this migration, we'll do them sequentially as consistent with other parts of the app
    const { data: request, error: pError } = await supabase
      .from('payout_requests')
      .insert({
        organization_id: artist.id,
        amount_cents: amountCents,
        method,
        destination,
        status: 'PENDING'
      })
      .select()
      .single();

    if (pError) throw pError;

    const { error: uError } = await supabase
      .from('organizations')
      .update({ balance_cents: org.balance_cents - amountCents })
      .eq('id', artist.id);

    if (uError) {
      // Manual rollback attempt if update fails (very basic)
      await supabase.from('payout_requests').delete().eq('id', request.id);
      throw uError;
    }

    return NextResponse.json({ success: true, request });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Payouts POST error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

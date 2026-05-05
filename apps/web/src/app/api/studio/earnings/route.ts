export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeResponse, aliasFields } from '@/lib/private/sanitize';
import { getSessionArtist } from '@/lib/session';

export async function GET() {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = await createClient();

    // Fetch organization with royalties and active subscriptions
    const [
      { data: org, error: orgError },
      { data: royalties, error: rError },
      { data: subscriptions, error: sError }
    ] = await Promise.all([
      supabase
        .from('organizations')
        .select('*')
        .eq('id', artist.id)
        .maybeSingle(),
      supabase
        .from('artist_royalties')
        .select('*')
        .eq('organization_id', artist.id)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('supporter_subscriptions')
        .select('price_cents')
        .eq('organization_id', artist.id)
        .eq('status', 'ACTIVE')
    ]);

    if (orgError || !org) throw orgError || new Error("Organization not found");
    if (rError || sError) throw rError || sError;

    const safeRoyalties = royalties || [];
    const safeSubscriptions = subscriptions || [];

    interface SupabaseRoyalty {
      id: string;
      year: number;
      month: number;
      total_earnings?: number;
      status: string;
    }

    interface SupabaseSubscriptionData {
      price_cents?: number;
    }

    // Format payouts for the UI
    const payouts = safeRoyalties.map((r: SupabaseRoyalty) => ({
      id: r.id,
      date: new Date(r.year, r.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      amount: (r.total_earnings || 0) / 100,
      status: r.status,
      type: 'Direct Settlement'
    }));

    // Generate chart data (last 6 months)
    const chartData = safeRoyalties.slice().reverse().map((r: SupabaseRoyalty) => ({
      label: new Date(r.year, r.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      value: (r.total_earnings || 0) / 100
    }));

    // Calculate current month's projected support
    const activesupportCents = safeSubscriptions.reduce((sum: number, p: SupabaseSubscriptionData) => sum + (p.price_cents || 0), 0);

    const responseData = {
      balance: (org.balance_cents || 0) / 100,
      payouts,
      chartData,
      stats: {
        activesupportCents,
        supporterCount: org.supporter_count || 0,
        totalEarningsCents: safeRoyalties.reduce((sum: number, r: SupabaseRoyalty) => sum + (r.total_earnings || 0), 0)
      }
    };

    return NextResponse.json(sanitizeResponse(aliasFields(responseData as Record<string, unknown>)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Earnings API error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

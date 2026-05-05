export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSessionFanId } from '@/lib/session';

interface SupabaseShare {
  id: string;
  amount_earned: number;
  created_at: string;
  status: string;
  organizations?: {
    name: string;
    slug: string;
    profile_image_url: string;
  };
}

export async function GET() {
  try {
    const fanId = await getSessionFanId();
    if (!fanId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const supabase = await createClient();

    const { data: sharesData, error } = await supabase
      .from('fan_royalty_shares')
      .select(`
        *,
        organizations (
          name,
          slug,
          profile_image_url
        )
      `)
      .eq('fan_id', fanId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Type normalization for UI compatibility
    const shares = (sharesData as SupabaseShare[] || []).map(s => ({
      ...s,
      Organization: s.organizations ? {
        name: s.organizations.name,
        slug: s.organizations.slug,
        profileImageUrl: s.organizations.profile_image_url
      } : { name: 'Unknown Artist', slug: '', profileImageUrl: '' }
    }));

    // Grouping logic for yield overview
    const totalEarned = shares.reduce((sum: number, s) => sum + (s.amount_earned || 0), 0);
    const activePositions = shares.filter(s => s.status === 'CREDITED').length;

    // Recent payout events for high-fidelity UI
    const payouts = shares
      .filter(s => (s.amount_earned || 0) > 0)
      .map(s => ({
        id: `payout-${s.id}`,
        artistName: s.Organization.name,
        amount: s.amount_earned,
        date: s.created_at,
        type: 'STREAMS_YIELD'
      }));

    return NextResponse.json({ 
      success: true, 
      history: shares,
      stats: {
        totalEarned,
        activePositions,
        currency: 'USD'
      },
      recentPayouts: payouts
    });
  } catch (error: unknown) {
    console.error('Yield History API error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [
      { count: totalVotes },
      { count: activeProposals },
      { data: subs }
    ] = await Promise.all([
      supabase.from('votes').select('*', { count: 'exact', head: true }),
      supabase.from('proposals').select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString()),
      supabase.from('supporter_subscriptions').select('price_cents').eq('status', 'ACTIVE')
    ]);

    const totalEquityCents = (subs || []).reduce((sum, s) => sum + (s.price_cents || 0), 0);

    // Calculate "Consensus" (ratio of YES votes over total votes)
    const { count: yesVotes } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('vote_type', 'YES');

    const consensus = totalVotes && totalVotes > 0 ? ((yesVotes || 0) / totalVotes) * 100 : 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalVotes: totalVotes || 0,
        activeProposals: activeProposals || 0,
        consensus: consensus.toFixed(1),
        lockedEquity: totalEquityCents / 100
      }
    });
  } catch (error: unknown) {
    console.error('Governance stats error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

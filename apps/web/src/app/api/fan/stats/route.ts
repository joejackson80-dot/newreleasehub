export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const fanId = await getSessionFanId();
    if (!fanId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminClient();

    const { data: stats, error: statsError } = await supabase
      .from('fan_listening_stats')
      .select('*')
      .eq('fan_id', fanId)
      .maybeSingle();

    if (statsError) throw statsError;

    // Calculate first discoveries (simplified: active supporter subscriptions)
    const { count: discoveries } = await supabase
      .from('supporter_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('fan_id', fanId)
      .eq('status', 'ACTIVE');

    return NextResponse.json({ 
      success: true, 
      stats: {
        ...(stats || {}),
        firstDiscoveriesCount: discoveries || 0
      }
    });
  } catch (error: unknown) {
    console.error('Fan Stats API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

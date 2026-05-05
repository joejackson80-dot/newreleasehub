import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Secret to verify cron caller
const CRON_SECRET = process.env.CRON_SECRET || 'dev_cron_secret_123';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const supabase = createAdminClient();

    // Find all fan listening stats where the last listening date was before yesterday
    // This means they skipped a full day, so their streak is broken.
    const { data, error } = await supabase
      .from('fan_listening_stats')
      .update({ listening_streak: 0 })
      .lt('last_listening_date', yesterday.toISOString())
      .gt('listening_streak', 0)
      .select('id');

    if (error) throw error;

    const count = data?.length || 0;
    console.log(`[Cron] Reset ${count} broken listening streaks.`);

    return NextResponse.json({ success: true, resetCount: count });
  } catch (error: unknown) {
    console.error('Streak Decay Cron Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Check for CRON_SECRET in production
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('collab_requests')
      .update({ status: 'EXPIRED' })
      .lt('expires_at', new Date().toISOString())
      .eq('status', 'PENDING')
      .select('id');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      expiredCount: data?.length || 0
    });
  } catch (error: unknown) {
    console.error('Collab expiration cron error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

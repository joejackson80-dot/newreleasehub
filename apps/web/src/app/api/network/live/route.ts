export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: liveStations, error } = await supabase
      .from('organizations')
      .select('id, name, slug, profile_image_url, live_listener_count, is_verified')
      .eq('is_live', true);

    if (error) throw error;

    return NextResponse.json({ success: true, stations: liveStations });
  } catch (error: unknown) {
    console.error('Network Live API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

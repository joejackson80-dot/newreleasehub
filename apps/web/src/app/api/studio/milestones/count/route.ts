export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtistId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const artistId = await getSessionArtistId();
    if (!artistId) {
      return NextResponse.json({ count: 0 });
    }

    const supabase = createAdminClient();

    const { count, error } = await supabase
      .from('artist_milestones')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', artistId)
      .eq('is_viewed', false);

    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error: unknown) {
    console.error('Milestones count error:', error);
    return NextResponse.json({ count: 0 });
  }
}

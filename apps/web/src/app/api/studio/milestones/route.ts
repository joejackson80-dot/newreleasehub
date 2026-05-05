export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtistId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const artistId = await getSessionArtistId();
    if (!artistId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const supabase = createAdminClient();

    const { data: milestones, error: fetchError } = await supabase
      .from('artist_milestones')
      .select('*')
      .eq('artist_id', artistId)
      .order('achieved_at', { ascending: false });

    if (fetchError) throw fetchError;

    // Also mark as viewed if requested
    const markViewed = searchParams.get('markViewed') === 'true';
    if (markViewed) {
      await supabase
        .from('artist_milestones')
        .update({ is_viewed: true })
        .eq('artist_id', artistId)
        .eq('is_viewed', false);
    }

    return NextResponse.json(milestones || []);
  } catch (error: unknown) {
    console.error('Milestones GET error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { milestoneId } = await req.json();
    const supabase = createAdminClient();

    const { data: updated, error } = await supabase
      .from('artist_milestones')
      .update({
        is_shared: true,
        shared_at: new Date().toISOString()
      })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Milestones PATCH error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

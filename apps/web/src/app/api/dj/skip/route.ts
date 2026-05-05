export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { sessionDeckId } = await req.json();

    if (!sessionDeckId) {
      return NextResponse.json({ error: 'Session Deck ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Get the first item in the queue
    const { data: nextItem, error: nextError } = await supabase
      .from('deck_queue_items')
      .select(`
        *,
        tracks (*)
      `)
      .eq('deck_id', sessionDeckId)
      .order('position', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextError || !nextItem) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 400 });
    }

    const nextTrack = nextItem.tracks;

    // 2. Update the session deck
    const { data: updatedDeck, error: updateError } = await supabase
      .from('session_decks')
      .update({
        active_track_title: nextTrack?.title,
        active_track_id: nextTrack?.id,
        is_playing: true
      })
      .eq('id', sessionDeckId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Remove from queue
    const { error: deleteError } = await supabase
      .from('deck_queue_items')
      .delete()
      .eq('id', nextItem.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ 
      success: true, 
      activeTrackTitle: updatedDeck.active_track_title,
      activeTrackId: updatedDeck.active_track_id
    });
  } catch (error: unknown) {
    console.error('DJ Skip POST error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

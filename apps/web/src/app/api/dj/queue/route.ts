export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { sessionDeckId, musicAssetId } = await req.json();

    if (!sessionDeckId || !musicAssetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Get max position
    const { data: maxPosData, error: maxError } = await supabase
      .from('deck_queue_items')
      .select('position')
      .eq('deck_id', sessionDeckId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxError) throw maxError;

    const nextPos = (maxPosData?.position ?? -1) + 1;

    // 2. Create Queue Item
    const { data: queueItem, error: createError } = await supabase
      .from('deck_queue_items')
      .insert({
        deck_id: sessionDeckId,
        track_id: musicAssetId,
        position: nextPos
      })
      .select(`
        *,
        tracks (*)
      `)
      .single();

    if (createError) throw createError;

    // Normalize for response
    const normalized = {
      ...queueItem,
      MusicAsset: queueItem.tracks
    };

    return NextResponse.json(normalized);
  } catch (error: unknown) {
    console.error('DJ Queue POST error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) throw new Error("ID is required");

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('deck_queue_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('DJ Queue DELETE error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

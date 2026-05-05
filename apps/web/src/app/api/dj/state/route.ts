export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createStationStream } from '@/lib/private/discovery/mux';

export const runtime = 'nodejs';

// Helper to find or seed deck by slug
async function getOrSeedDeckBySlug(slug: string) {
  const supabase = createAdminClient();

  // 1. Get Organization with its session deck and queue
  let { data: org } = await supabase
    .from('organizations')
    .select(`
      id,
      slug,
      name,
      session_decks (
        *,
        deck_queue_items (
          *,
          tracks (*)
        )
      )
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (!org) {
    const { data: newOrg } = await supabase
      .from('organizations')
      .insert({
        slug,
        name: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
      })
      .select(`
        id,
        slug,
        name,
        session_decks (
          *,
          deck_queue_items (
            *,
            tracks (*)
          )
        )
      `)
      .single();
    org = newOrg;
  }

  if (!org) throw new Error("Failed to find or create organization");

  let sessionDeck = org.session_decks?.[0];

  if (!sessionDeck) {
    const { data: newDeck } = await supabase
      .from('session_decks')
      .insert({
        organization_id: org.id,
        active_track_title: "The Zodiac Album",
        is_playing: true,
        fire_count: 1204,
        cool_count: 512,
        trash_count: 42
      })
      .select(`
        *,
        deck_queue_items (
          *,
          tracks (*)
        )
      `)
      .single();
    sessionDeck = newDeck;
  }

  // Get active asset if it exists
  let activeAsset = null;
  if (sessionDeck?.active_track_id) {
    const { data: asset } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', sessionDeck.active_track_id)
      .maybeSingle();
    activeAsset = asset;
  }

  // Ensure there's at least one music asset
  const { data: asset } = await supabase
    .from('tracks')
    .select('*')
    .eq('organization_id', org.id)
    .limit(1)
    .maybeSingle();

  if (!asset) {
    await supabase
      .from('tracks')
      .insert({
        organization_id: org.id,
        title: "The Zodiac Album",
        audio_url: "/music/default.mp3",
        allocated_license_bps: 0
      });
  }
  
  if (!sessionDeck) throw new Error("Failed to initialize session deck");

  // Normalize for UI (camelCase mapping if needed, but we can return raw for now and normalize in client or here)
  return { 
    ...sessionDeck, 
    activeAsset,
    // Add camelCase aliases for legacy compatibility if required
    isPlaying: sessionDeck.is_playing,
    activeTrackTitle: sessionDeck.active_track_title,
    activeTrackId: sessionDeck.active_track_id,
    backgroundUrl: sessionDeck.background_url,
    Queue: (sessionDeck.deck_queue_items || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position).map((item: { tracks: unknown }) => ({
      ...item,
      MusicAsset: item.tracks
    }))
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || "hellz-flame";
    const deck = await getOrSeedDeckBySlug(slug);
    
    // Also fetch Mux config for the viewer
    let muxConfig = null;
    try {
      const stream = await createStationStream(`artist-${slug}`);
      muxConfig = {
        playbackId: stream.playback_ids?.[0]?.id,
        status: stream.status
      };
    } catch (e) {
      console.error('Mux Config Error:', e);
    }

    return NextResponse.json({ ...deck, muxConfig });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isPlaying, activeTrackTitle, activeTrackId, backgroundUrl, slug } = await req.json();
    const currentSlug = slug || "hellz-flame";
    
    const supabase = createAdminClient();
    const deck = await getOrSeedDeckBySlug(currentSlug);

    const { data: updatedDeck, error: uError } = await supabase
      .from('session_decks')
      .update({
        ...(isPlaying !== undefined && { is_playing: isPlaying }),
        ...(activeTrackTitle && { active_track_title: activeTrackTitle }),
        ...(activeTrackId && { active_track_id: activeTrackId }),
        ...(backgroundUrl && { background_url: backgroundUrl })
      })
      .eq('id', deck.id)
      .select(`
        *,
        deck_queue_items (
          *,
          tracks (*)
        )
      `)
      .single();

    if (uError) throw uError;

    // Normalize for response
    const normalized = {
      ...updatedDeck,
      isPlaying: updatedDeck.is_playing,
      activeTrackTitle: updatedDeck.active_track_title,
      activeTrackId: updatedDeck.active_track_id,
      backgroundUrl: updatedDeck.background_url,
      Queue: (updatedDeck.deck_queue_items || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position).map((item: { tracks: unknown }) => ({
        ...item,
        MusicAsset: item.tracks
      }))
    };

    return NextResponse.json(normalized);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const supabase = createAdminClient();

    // 1. Fetch Station with NowPlaying track and its Organization
    const { data: station, error: stationError } = await supabase
      .from('stations')
      .select(`
        *,
        now_playing:tracks!now_playing_id (
          *,
          organizations (*)
        )
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (stationError || !station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // 2. Fetch Play History (last 10 tracks)
    const { data: history, error: historyError } = await supabase
      .from('play_history')
      .select(`
        *,
        tracks (
          *,
          organizations (*)
        )
      `)
      .eq('station_id', station.id)
      .order('played_at', { ascending: false })
      .limit(10);

    if (historyError) throw historyError;

    const nowPlayingTrack = station.now_playing;
    const nowPlayingOrg = nowPlayingTrack?.organizations;

    return NextResponse.json({
      isLive: station.is_live,
      playbackId: station.playback_id || nowPlayingOrg?.live_playback_id,
      nowPlaying: nowPlayingTrack ? {
        id: nowPlayingTrack.id,
        title: nowPlayingTrack.title,
        artist: nowPlayingOrg?.name,
        artistSlug: nowPlayingOrg?.slug,
        artistId: nowPlayingOrg?.id,
        imageUrl: nowPlayingTrack.image_url || nowPlayingOrg?.profile_image_url,
        audioUrl: nowPlayingTrack.audio_url,
      } : null,
      recentlyPlayed: (history || []).map((ph: any) => {
        const t = ph.tracks;
        const o = t?.organizations;
        return {
          id: t?.id,
          title: t?.title,
          artist: o?.name,
          artistSlug: o?.slug,
          imageUrl: t?.image_url || o?.profile_image_url,
          playedAt: ph.played_at
        };
      }),
      updatedAt: station.updated_at,
    });
  } catch (error: unknown) {
    console.error('Radio API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

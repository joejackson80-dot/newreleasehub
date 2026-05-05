'use server';

import { getSessionArtist } from '@/lib/session';
import { createStationStream } from '@/lib/private/discovery/mux';
import { createClient } from '@/lib/supabase/server';

export async function getLiveStreamConfig() {
  try {
    const artist = await getSessionArtist();
    if (!artist) throw new Error("Unauthorized");
    
    // Use artist slug as the external_id for Mux
    const stream = await createStationStream(`artist-${artist.slug}`);
    
    const supabase = await createClient();

    // Update artist status and playback ID in DB
    const { error } = await supabase
      .from('organizations')
      .update({ 
        is_live: stream.status === 'active',
        live_playback_id: stream.playback_ids?.[0]?.id
      })
      .eq('id', artist.id);

    if (error) throw error;

    return {
      success: true,
      streamKey: stream.stream_key,
      playbackId: stream.playback_ids?.[0]?.id,
      rtmpUrl: 'rtmp://global-live.mux.com:5222/app',
      status: stream.status
    };
  } catch (error: unknown) {
    console.error('[Live Stream Config Error]', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateLiveStatus(isLive: boolean) {
  try {
    const artist = await getSessionArtist();
    if (!artist) throw new Error("Unauthorized");

    const supabase = await createClient();

    const { error } = await supabase
      .from('organizations')
      .update({ is_live: isLive })
      .eq('id', artist.id);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

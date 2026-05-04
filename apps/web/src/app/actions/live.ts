'use server';

import { getSessionArtist } from '@/lib/session';
import { createStationStream } from '@/lib/private/discovery/mux';
import { prisma } from '@/lib/prisma';

export async function getLiveStreamConfig() {
  try {
    const artist = await getSessionArtist();
    
    // Use artist slug as the external_id for Mux
    const stream = await createStationStream(`artist-${artist.slug}`);
    
    // Update artist status and playback ID in DB
    await prisma.organization.update({
      where: { id: artist.id },
      data: { 
        isLive: stream.status === 'active',
        livePlaybackId: stream.playback_ids?.[0]?.id
      }
    });

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
    await prisma.organization.update({
      where: { id: artist.id },
      data: { isLive }
    });
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}



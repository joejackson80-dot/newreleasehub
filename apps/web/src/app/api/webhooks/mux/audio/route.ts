import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Optional: Verify Mux webhook signature in production
    // const sig = req.headers.get('mux-signature');
    // if (process.env.NODE_ENV === 'production' && !verifyMuxSignature(sig, body)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    console.log(`📡 Mux Webhook: ${type} | external_id: ${data?.external_id}`);
    const externalId = data?.external_id;
    if (!externalId) {
      return NextResponse.json({ received: true, skipped: 'no external_id' });
    }

    const isArtistStream = externalId.startsWith('artist-');
    const slug = isArtistStream ? externalId.replace('artist-', '') : externalId;

    // ── STREAM GOES ACTIVE ──
    if (type === 'video.live_stream.active') {
      const playbackId = data.playback_ids?.[0]?.id;

      if (isArtistStream) {
        await prisma.organization.updateMany({
          where: { slug },
          data: { 
            isLive: true,
            livePlaybackId: playbackId || undefined,
          },
        });
        console.log(`✅ Artist @${slug} is now LIVE (playbackId: ${playbackId})`);
      } else {
        await prisma.station.update({
          where: { slug },
          data: { 
            isLive: true,
            playbackId: playbackId || undefined,
          },
        });
        console.log(`✅ Station ${slug} is now LIVE`);
      }
    }

    // ── STREAM GOES IDLE ──
    if (type === 'video.live_stream.idle') {
      if (isArtistStream) {
        await prisma.organization.updateMany({
          where: { slug },
          data: { isLive: false },
        });
        console.log(`🛑 Artist @${slug} is now OFFLINE`);
      } else {
        await prisma.station.update({
          where: { slug },
          data: { 
            isLive: false,
            nowPlayingId: null,
          },
        });
        console.log(`🛑 Station ${slug} is now OFFLINE`);
      }
    }

    // ── STREAM DISCONNECTED (abnormal) ──
    if (type === 'video.live_stream.disconnected') {
      if (isArtistStream) {
        await prisma.organization.updateMany({
          where: { slug },
          data: { isLive: false },
        });
        console.log(`⚠️ Artist @${slug} disconnected unexpectedly`);
      } else {
        await prisma.station.update({
          where: { slug },
          data: { isLive: false, nowPlayingId: null },
        });
        console.log(`⚠️ Station ${slug} disconnected unexpectedly`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Mux Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}



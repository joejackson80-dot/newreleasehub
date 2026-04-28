import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log(`📡 Mux Webhook Received: ${type}`);

    if (type === 'video.live_stream.active') {
      const externalId = data.external_id;
      if (externalId) {
        await prisma.station.update({
          where: { slug: externalId },
          data: { isLive: true },
        });
        console.log(`✅ Station ${externalId} is now LIVE.`);
      }
    }

    if (type === 'video.live_stream.idle') {
      const externalId = data.external_id;
      if (externalId) {
        await prisma.station.update({
          where: { slug: externalId },
          data: { 
            isLive: false,
            nowPlayingId: null,
          },
        });
        console.log(`🛑 Station ${externalId} is now OFFLINE.`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

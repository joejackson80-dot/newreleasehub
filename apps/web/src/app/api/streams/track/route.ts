import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeResponse, safeError } from '@/lib/private/sanitize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { trackId, artistId, userId, deviceId } = await req.json();

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    let fanData = null;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { SupporterSubscriptions: { where: { artistId, status: 'ACTIVE' } } }
      });

      if (user) {
        let type = 'free';
        if (user.SupporterSubscriptions.length > 0) type = 'SUPPORTER';
        else if (user.subscriptionStatus === 'subscriber' || user.subscriptionStatus === 'supporter') type = 'subscriber';
        fanData = { id: user.id, type };
      }
    }

    const { startStreamPlay } = await import('@/lib/private/royalties/calculateRoyalties');
    const streamId = await startStreamPlay(trackId, artistId, fanData, {
      ip,
      userAgent,
      deviceId: deviceId || 'unknown'
    });
    const stream = await prisma.streamPlay.findUnique({ where: { id: streamId } });

    return NextResponse.json(sanitizeResponse(stream));
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { streamPlayId, durationSeconds, countedAsStream } = await req.json();

    const { markStreamCounted, finalizeStreamPlay } = await import('@/lib/private/royalties/calculateRoyalties');
    if (countedAsStream) {
      await markStreamCounted(streamPlayId);
    } else {
      await finalizeStreamPlay(streamPlayId, durationSeconds);
    }

    const stream = await prisma.streamPlay.findUnique({ where: { id: streamPlayId } });
    return NextResponse.json(sanitizeResponse(stream));
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

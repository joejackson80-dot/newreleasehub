import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeResponse, safeError } from '@/lib/private/sanitize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { trackId, artistId, userId, deviceId } = await req.json();
    const supabase = await createClient();

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    let fanData = null;

    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('*, supporter_subscriptions(*)')
        .eq('id', userId)
        .eq('supporter_subscriptions.artist_id', artistId)
        .eq('supporter_subscriptions.status', 'ACTIVE')
        .maybeSingle();

      if (user) {
        let type = 'free';
        if (user.supporter_subscriptions && user.supporter_subscriptions.length > 0) type = 'SUPPORTER';
        else if (user.subscription_status === 'subscriber' || user.subscription_status === 'supporter') type = 'subscriber';
        fanData = { id: user.id, type };
      }
    }

    const { startStreamPlay } = await import('@/lib/private/royalties/calculateRoyalties');
    const streamId = await startStreamPlay(trackId, artistId, fanData, {
      ip,
      userAgent,
      deviceId: deviceId || 'unknown'
    });

    const { data: stream } = await supabase
      .from('stream_plays')
      .select('*')
      .eq('id', streamId)
      .single();

    return NextResponse.json(sanitizeResponse(stream));
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { streamPlayId, durationSeconds, countedAsStream } = await req.json();
    const supabase = await createClient();

    const { markStreamCounted, finalizeStreamPlay } = await import('@/lib/private/royalties/calculateRoyalties');
    if (countedAsStream) {
      await markStreamCounted(streamPlayId);
    } else {
      await finalizeStreamPlay(streamPlayId, durationSeconds);
    }

    const { data: stream } = await supabase
      .from('stream_plays')
      .select('*')
      .eq('id', streamPlayId)
      .single();

    return NextResponse.json(sanitizeResponse(stream));
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log(`📡 Mux Webhook: ${type} | external_id: ${data?.external_id}`);
    const externalId = data?.external_id;
    if (!externalId) {
      return NextResponse.json({ received: true, skipped: 'no external_id' });
    }

    const isArtistStream = externalId.startsWith('artist-');
    const slug = isArtistStream ? externalId.replace('artist-', '') : externalId;

    const supabase = createAdminClient();

    // ── STREAM GOES ACTIVE ──
    if (type === 'video.live_stream.active') {
      const playbackId = data.playback_ids?.[0]?.id;

      if (isArtistStream) {
        await supabase
          .from('organizations')
          .update({ 
            is_live: true,
            live_playback_id: playbackId || null,
          })
          .eq('slug', slug);
        console.log(`✅ Artist @${slug} is now LIVE (playbackId: ${playbackId})`);
      } else {
        await supabase
          .from('stations')
          .update({ 
            is_live: true,
            playback_id: playbackId || null,
          })
          .eq('slug', slug);
        console.log(`✅ Station ${slug} is now LIVE`);
      }
    }

    // ── STREAM GOES IDLE ──
    if (type === 'video.live_stream.idle') {
      if (isArtistStream) {
        await supabase
          .from('organizations')
          .update({ is_live: false })
          .eq('slug', slug);
        console.log(`🛑 Artist @${slug} is now OFFLINE`);
      } else {
        await supabase
          .from('stations')
          .update({ 
            is_live: false,
            now_playing_id: null,
          })
          .eq('slug', slug);
        console.log(`🛑 Station ${slug} is now OFFLINE`);
      }
    }

    // ── STREAM DISCONNECTED (abnormal) ──
    if (type === 'video.live_stream.disconnected') {
      if (isArtistStream) {
        await supabase
          .from('organizations')
          .update({ is_live: false })
          .eq('slug', slug);
        console.log(`⚠️ Artist @${slug} disconnected unexpectedly`);
      } else {
        await supabase
          .from('stations')
          .update({ is_live: false, now_playing_id: null })
          .eq('slug', slug);
        console.log(`⚠️ Station ${slug} disconnected unexpectedly`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Mux Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

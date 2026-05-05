export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { safeError } from '@/lib/api/errors'

export async function POST(req: NextRequest) {
  try {
    const { streamPlayId, interactionSignals } = await req.json()
    const supabase = createAdminClient();
    
    const { data: streamPlay, error: sError } = await supabase
      .from('stream_plays')
      .select('*')
      .eq('id', streamPlayId)
      .maybeSingle();
    
    if (sError || !streamPlay) {
      return NextResponse.json(safeError('Stream play not found', 404), { status: 404 })
    }
    
    // Calculate fraud score based on signals
    let fraudScore = 1.0
    let flagReason: string | null = null
    let isExcluded = false
    
    // Rule 1: If IP is datacenter, reduce score
    if (streamPlay.ip_is_datacenter) {
      fraudScore *= 0.3
      flagReason = 'Datacenter IP detected'
    }
    
    // Rule 2: If no interaction signals, reduce score
    const interactionCount = [
      interactionSignals.hadMouseMovement,
      interactionSignals.hadKeyboardInput,
      interactionSignals.wasTabVisible,
    ].filter(Boolean).length
    
    if (interactionCount === 0) {
      fraudScore *= 0.2
      flagReason = (flagReason ? flagReason + ' + ' : '') + 'No user interaction detected'
    } else if (interactionCount === 1) {
      fraudScore *= 0.6
    }
    
    // Rule 3: If audio was muted, reduce score
    if (interactionSignals.wasAudioMuted) {
      fraudScore *= 0.5
      flagReason = (flagReason ? flagReason + ' + ' : '') + 'Audio muted'
    }
    
    // Rule 4: Check device volume this hour
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { count: recentStreamsFromDevice } = await supabase
      .from('stream_plays')
      .select('*', { count: 'exact', head: true })
      .eq('device_id', streamPlay.device_id)
      .gte('started_at', oneHourAgo);
    
    if ((recentStreamsFromDevice || 0) > 30) {
      fraudScore *= 0.1
      flagReason = (flagReason ? flagReason + ' + ' : '') + 'Device rate limit exceeded'
    }
    
    // Rule 5: Exclude if fraud score too low
    if (fraudScore < 0.3) {
      isExcluded = true
    }
    
    // Update stream play record
    const { data: updated, error: uError } = await supabase
      .from('stream_plays')
      .update({
        counted_as_stream: !isExcluded,
        fraud_score: fraudScore,
        is_excluded_from_pool: isExcluded,
        flag_reason: flagReason,
        had_mouse_movement: interactionSignals.hadMouseMovement,
        had_keyboard_input: interactionSignals.hadKeyboardInput,
        was_tab_visible: interactionSignals.wasTabVisible,
        was_audio_muted: interactionSignals.wasAudioMuted,
      })
      .eq('id', streamPlayId)
      .select('*, tracks(*)')
      .single();

    if (uError) {
      console.error('Error updating stream play:', uError);
    }

    // --- FAN CHART TRACKING SYSTEM ---
    if (!isExcluded && streamPlay.listener_id) {
      const fanId = streamPlay.listener_id;
      const artistId = streamPlay.artist_id;
      const track = Array.isArray(updated?.tracks) ? updated.tracks[0] : updated?.tracks;
      const trackDurationSecs = track?.duration || 0;

      // 1. Update fan_artist_relations
      const { data: rel } = await supabase
        .from('fan_artist_relations')
        .select('*')
        .eq('fan_id', fanId)
        .eq('artist_id', artistId)
        .maybeSingle();

      if (rel) {
        await supabase
          .from('fan_artist_relations')
          .update({
            stream_count: (rel.stream_count || 0) + 1,
            stream_count_7d: (rel.stream_count_7d || 0) + 1,
            stream_count_30d: (rel.stream_count_30d || 0) + 1,
            last_stream_at: new Date().toISOString(),
          })
          .eq('id', rel.id);
      } else {
        await supabase
          .from('fan_artist_relations')
          .insert({
            fan_id: fanId,
            artist_id: artistId,
            stream_count: 1,
            stream_count_7d: 1,
            stream_count_30d: 1,
            first_stream_at: new Date().toISOString(),
            last_stream_at: new Date().toISOString(),
          });
      }

      // 2. Update fan_listening_stats
      const { data: stats } = await supabase
        .from('fan_listening_stats')
        .select('*')
        .eq('fan_id', fanId)
        .maybeSingle();

      if (stats) {
        await supabase
          .from('fan_listening_stats')
          .update({
            total_streams_all_time: (stats.total_streams_all_time || 0) + 1,
            total_streams_7d:      (stats.total_streams_7d || 0) + 1,
            total_streams_30d:     (stats.total_streams_30d || 0) + 1,
            total_listening_hrs:   (stats.total_listening_hrs || 0) + (trackDurationSecs / 3600),
            updated_at:           new Date().toISOString(),
          })
          .eq('id', stats.id);
      } else {
        await supabase
          .from('fan_listening_stats')
          .insert({
            fan_id: fanId,
            total_streams_all_time: 1,
            total_streams_7d:      1,
            total_streams_30d:     1,
            total_listening_hrs:   trackDurationSecs / 3600,
          });
      }

      // 3. First Discovery Tracking
      const { data: artist } = await supabase
        .from('organizations')
        .select('chart_position_genre, chart_position_global')
        .eq('id', artistId)
        .maybeSingle();

      if (artist && !artist.chart_position_genre && !artist.chart_position_global) {
        if (stats) {
          await supabase
            .from('fan_listening_stats')
            .update({ first_discoveries: (stats.first_discoveries || 0) + 1 })
            .eq('id', stats.id);
        }
      }
    }
    
    return NextResponse.json({ counted: !isExcluded, fraudScore })
  } catch (error) {
    console.error('[STREAM_COUNT_ERROR]', error);
    return NextResponse.json(safeError(error), { status: 500 })
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';

export async function GET() {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const supabase = await createClient();

    // Aggregate Stream Data
    const { data: streams, error } = await supabase
      .from('stream_plays')
      .select('started_at, ip_country, fraud_score, counted_as_stream, play_duration_seconds')
      .eq('artist_id', artist.id)
      .order('started_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    const safeStreams = streams || [];

    interface StreamPlayData {
      started_at: string;
      ip_country?: string;
      fraud_score?: number;
      counted_as_stream?: boolean;
      play_duration_seconds?: number;
    }

    // Group by Country
    const countryDistribution = safeStreams.reduce((acc: Record<string, number>, s: StreamPlayData) => {
      const country = s.ip_country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Heuristic Score Distribution (High = Legit, Low = Suspicious)
    const fraudMetrics = {
      clean: safeStreams.filter((s: StreamPlayData) => (s.fraud_score || 0) >= 0.8).length,
      suspicious: safeStreams.filter((s: StreamPlayData) => (s.fraud_score || 0) >= 0.3 && (s.fraud_score || 0) < 0.8).length,
      rejected: safeStreams.filter((s: StreamPlayData) => (s.fraud_score || 0) < 0.3).length,
    };

    // Calculate Daily Streams (Simple version)
    const dailyStreams = safeStreams.reduce((acc: Record<string, number>, s: StreamPlayData) => {
      const date = new Date(s.started_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      stats: {
        totalStreams: safeStreams.length,
        verifiedStreams: safeStreams.filter((s: StreamPlayData) => s.counted_as_stream).length,
        avgDuration: safeStreams.reduce((acc: number, s: StreamPlayData) => acc + (s.play_duration_seconds || 0), 0) / (safeStreams.length || 1),
        countryDistribution,
        fraudMetrics,
        dailyStreams: Object.entries(dailyStreams).map(([date, count]) => ({ date, count })).slice(0, 14)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Analytics API error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

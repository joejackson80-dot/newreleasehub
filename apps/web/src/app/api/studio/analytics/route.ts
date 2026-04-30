import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';

export async function GET() {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Aggregate Stream Data
    const streams = await prisma.streamPlay.findMany({
      where: { artistId: artist.id },
      orderBy: { startedAt: 'desc' },
      take: 1000,
      select: {
        startedAt: true,
        ipCountry: true,
        fraudScore: true,
        countedAsStream: true,
        playDurationSeconds: true
      }
    });

    // Group by Country
    const countryDistribution = streams.reduce((acc: any, s) => {
      const country = s.ipCountry || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Heuristic Score Distribution (High = Legit, Low = Suspicious)
    const fraudMetrics = {
      clean: streams.filter(s => s.fraudScore >= 0.8).length,
      suspicious: streams.filter(s => s.fraudScore >= 0.3 && s.fraudScore < 0.8).length,
      rejected: streams.filter(s => s.fraudScore < 0.3).length,
    };

    // Calculate Daily Streams (Simple version)
    const dailyStreams = streams.reduce((acc: any, s) => {
      const date = s.startedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      stats: {
        totalStreams: streams.length,
        verifiedStreams: streams.filter(s => s.countedAsStream).length,
        avgDuration: streams.reduce((acc, s) => acc + (s.playDurationSeconds || 0), 0) / (streams.length || 1),
        countryDistribution,
        fraudMetrics,
        dailyStreams: Object.entries(dailyStreams).map(([date, count]) => ({ date, count })).slice(0, 14)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

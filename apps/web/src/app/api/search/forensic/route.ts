export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [], message: 'Query too short' });
  }

  try {
    // Search for flagged streams by artist ID or IP
    const flaggedStreams = await prisma.streamPlay.findMany({
      where: {
        OR: [
          { artistId: q },
          { ipAddress: q },
          { deviceId: q },
        ],
        isExcludedFromPool: true,
      },
      select: {
        id: true,
        artistId: true,
        ipAddress: true,
        deviceId: true,
        flagReason: true,
        fraudScore: true,
        startedAt: true,
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    // Search for fraud incidents
    const incidents = await prisma.fraudIncident.findMany({
      where: {
        OR: [
          { artistId: q },
          { type: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: { Organization: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      flaggedStreams,
      incidents,
      totalFlagged: flaggedStreams.length,
      totalIncidents: incidents.length,
    });
  } catch (error) {
    console.error('[Forensic Search Error]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


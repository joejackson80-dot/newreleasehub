import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtistId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const artistId = await getSessionArtistId();
    if (!artistId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await prisma.artistMilestone.count({
      where: { artistId, isViewed: false }
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    return NextResponse.json({ count: 0 });
  }
}

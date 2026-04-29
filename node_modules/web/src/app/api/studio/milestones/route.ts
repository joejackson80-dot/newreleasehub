import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtistId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const artistId = await getSessionArtistId();
    if (!artistId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const milestones = await prisma.artistMilestone.findMany({
      where: { artistId },
      orderBy: { achievedAt: 'desc' }
    });

    // Also mark as viewed if requested
    const markViewed = searchParams.get('markViewed') === 'true';
    if (markViewed) {
      await prisma.artistMilestone.updateMany({
        where: { artistId, isViewed: false },
        data: { isViewed: true }
      });
    }

    return NextResponse.json(milestones);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { milestoneId, isShared } = await req.json();
    const updated = await prisma.artistMilestone.update({
      where: { id: milestoneId },
      data: {
        isShared: true,
        sharedAt: new Date()
      }
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



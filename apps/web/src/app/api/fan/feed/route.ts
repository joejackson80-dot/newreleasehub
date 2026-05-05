export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const fanId = await getSessionFanId();
    if (!fanId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Fetch followed artists
    const follows = await prisma.follower.findMany({
      where: { userId: fanId },
      select: { organizationId: true }
    });

    const orgIds = follows.map(f => f.organizationId);

    // Fetch releases and posts from followed artists
    const releases = await prisma.release.findMany({
      where: {
        organizationId: { in: orgIds },
        isScheduled: false
      },
      include: {
        Organization: {
          select: { name: true, slug: true, profileImageUrl: true, isVerified: true }
        },
        Tracks: {
          take: 1,
          select: { audioUrl: true }
        }
      },
      orderBy: { releaseDate: 'desc' },
      take: 10
    });

    // Transform into feed items
    const feedItems = releases.map(r => ({
      id: r.id,
      type: 'release',
      title: r.title,
      content: `New ${r.type} just dropped — "${r.title}" is out now.`,
      coverArtUrl: r.coverArtUrl,
      audioUrl: r.Tracks?.[0]?.audioUrl || '',
      createdAt: r.releaseDate,
      Organization: r.Organization,
      isSupporterOnly: false,
      reactions: { fire: 0, heart: 0, crown: 0, bolt: 0 },
      comments: 0
    }));

    return NextResponse.json({ success: true, feed: feedItems });
  } catch (error: any) {
    console.error('Fan Feed API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


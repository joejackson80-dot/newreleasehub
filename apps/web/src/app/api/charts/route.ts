import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre') || 'Top Artists';
    const limit = 20;

    let ranking = [];

    if (genre === 'Top Artists') {
      ranking = await prisma.organization.findMany({
        where: {
          isArtist: true,
        },
        orderBy: [
          { supporterCount: 'desc' },
          { totalStreams: 'desc' }
        ],
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          profileImageUrl: true,
          supporterCount: true,
          totalStreams: true,
          genres: true,
          city: true,
        }
      });
    } else if (genre === 'Rising') {
      // For now, sort by recent streams or just a subset of artists with lower total streams but growing
      ranking = await prisma.organization.findMany({
        where: {
          isArtist: true,
          totalStreams: { gt: 0 }
        },
        orderBy: {
          supporterCount: 'desc' // We can improve this with actual rising logic
        },
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          profileImageUrl: true,
          supporterCount: true,
          totalStreams: true,
          genres: true,
          city: true,
        }
      });
    } else if (genre === 'Top Fans') {
      ranking = await prisma.user.findMany({
        where: { role: 'fan' },
        orderBy: [
          { fanLevel: 'desc' },
          { fanXP: 'desc' }
        ],
        take: limit,
        select: {
          id: true,
          displayName: true,
          username: true,
          avatarUrl: true,
          fanLevel: true,
          fanXP: true,
          badges: true,
        }
      });
    } else {
      // Specific genre
      ranking = await prisma.organization.findMany({
        where: {
          isArtist: true,
          genres: {
            has: genre
          }
        },
        orderBy: [
          { supporterCount: 'desc' },
          { totalStreams: 'desc' }
        ],
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          profileImageUrl: true,
          supporterCount: true,
          totalStreams: true,
          genres: true,
          city: true,
        }
      });
    }

    return NextResponse.json({ success: true, ranking });
  } catch (error: any) {
    console.error('Error fetching charts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

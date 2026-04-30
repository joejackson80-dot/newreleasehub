import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre') || 'Top Artists';
    const limit = 20;

    let ranking = [];

    if (genre === 'Top Artists') {
      const orgs = await prisma.organization.findMany({
        where: { isPublic: true },
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
          isVerified: true
        }
      });

      ranking = orgs.map(org => ({
        ...org,
        verifiedScore: Math.min(99, 70 + Math.floor(org.supporterCount / 10) + Math.min(20, Math.floor(org.totalStreams / 10000)))
      }));
    } else if (genre === 'Rising') {
      const orgs = await prisma.organization.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
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
          isVerified: true
        }
      });

      ranking = orgs.map(org => ({
        ...org,
        verifiedScore: Math.min(99, 65 + Math.floor(org.supporterCount / 5) + Math.min(15, Math.floor(org.totalStreams / 5000)))
      }));
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
      const orgs = await prisma.organization.findMany({
        where: {
          isPublic: true,
          genres: { has: genre }
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
          isVerified: true
        }
      });

      ranking = orgs.map(org => ({
        ...org,
        verifiedScore: Math.min(99, 70 + Math.floor(org.supporterCount / 10) + Math.min(20, Math.floor(org.totalStreams / 10000)))
      }));
    }

    return NextResponse.json({ success: true, ranking });
  } catch (error: any) {
    console.error('Error fetching charts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

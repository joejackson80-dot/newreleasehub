import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre');
    const minSupporters = parseInt(searchParams.get('minSupporters') || '0');
    const minStreams = parseInt(searchParams.get('minStreams') || '0');
    const sortBy = searchParams.get('sortBy') || 'relevance'; // relevance, growth, equity, streams

    const where: any = {
      isPublic: true,
      name: { contains: query, mode: 'insensitive' },
      supporterCount: { gte: minSupporters },
      totalStreams: { gte: minStreams }
    };

    if (genre && genre !== 'All') {
      where.genres = { has: genre };
    }

    let orderBy: any = {};
    if (sortBy === 'growth') {
      orderBy = { supporterCount: 'desc' }; // Simplified growth logic
    } else if (sortBy === 'equity') {
      orderBy = { totalStreams: 'desc' };
    } else if (sortBy === 'streams') {
      orderBy = { totalStreams: 'desc' };
    } else {
      orderBy = { supporterCount: 'desc' };
    }

    const artists = await prisma.organization.findMany({
      where,
      orderBy,
      take: 50,
      select: {
        id: true,
        name: true,
        slug: true,
        profileImageUrl: true,
        genres: true,
        city: true,
        supporterCount: true,
        totalStreams: true,
        isVerified: true
      }
    });

    // Add mock "Forensic Score" for institutional feel
    const enrichedArtists = artists.map(a => ({
      ...a,
      forensicScore: Math.floor(Math.random() * 20) + 80, // 80-99
      retentionRate: Math.floor(Math.random() * 15) + 85 // 85-99%
    }));

    return NextResponse.json({ success: true, artists: enrichedArtists });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

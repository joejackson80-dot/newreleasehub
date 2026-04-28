import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const station = await prisma.station.findUnique({
      where: { slug },
      include: {
        NowPlaying: {
          include: {
            Organization: true,
          }
        }
      }
    });

    if (!station) {
      return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    }

    // In a real app, we might also fetch recently played tracks here or via another endpoint
    // For now, let's just return the current station state
    return NextResponse.json({
      isLive: station.isLive,
      nowPlaying: station.NowPlaying ? {
        id: station.NowPlaying.id,
        title: station.NowPlaying.title,
        artist: station.NowPlaying.Organization.name,
        artistSlug: station.NowPlaying.Organization.slug,
        artistId: station.NowPlaying.Organization.id,
        imageUrl: station.NowPlaying.imageUrl || station.NowPlaying.Organization.profileImageUrl,
        audioUrl: station.NowPlaying.audioUrl,
      } : null,
      updatedAt: station.updatedAt,
    });
  } catch (error) {
    console.error('Radio API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

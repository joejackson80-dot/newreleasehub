import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Create Organizations
    const artists = [
      {
        slug: 'hellz-flame',
        name: 'Hellz Flame',
        bio: 'The hottest underground live music experience. Own the master, own the moment.',
      },
      {
        slug: 'vibe-master',
        name: 'Vibe Master',
        bio: 'Chill beats and visual journeys. Join the patronage movement.',
      }
    ];

    const results = [];

    for (const artist of artists) {
      const org = await prisma.organization.upsert({
        where: { slug: artist.slug },
        update: {},
        create: {
          slug: artist.slug,
          name: artist.name,
          bio: artist.bio,
        }
      });

      // 2. Create a Music Asset for each
      const asset = await prisma.musicAsset.upsert({
        where: { id: `asset-${org.slug}` },
        update: {},
        create: {
          id: `asset-${org.slug}`,
          organizationId: org.id,
          title: 'The Debut Master Collection',
          audioUrl: '/music/its-not-your-fault-hellz-flame.mp3',
          allocatedLicenseBps: 0,
        }
      });

      // 3. Create a Session Deck for each
      await prisma.sessionDeck.upsert({
        where: { organizationId: org.id },
        update: {},
        create: {
          organizationId: org.id,
          activeTrackTitle: 'Initializing First Set...',
          isPlaying: false,
          backgroundUrl: '/backgrounds/cyberpunk.png'
        }
      });

      results.push({ org, asset });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

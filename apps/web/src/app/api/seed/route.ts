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
        bio: 'Chill beats and visual journeys. Join the support movement.',
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

    // 4. Create Demo Fan (johndoe)
    const demoFan = await prisma.user.upsert({
      where: { username: 'johndoe' },
      update: {},
      create: {
        username: 'johndoe',
        email: 'johndoe@example.com',
        displayName: 'John Doe',
        passwordHash: '$2a$10$7R6v7v7v7v7v7v7v7v7v7ue', // Hardcoded hash for 'Password123'
        role: 'fan',
        fanLevel: 5,
        fanXP: 1250,
      }
    });

    // 5. Create Demo Artist (iamjoejack)
    const demoArtist = await prisma.organization.upsert({
      where: { username: 'iamjoejack' },
      update: {},
      create: {
        username: 'iamjoejack',
        email: 'joe@example.com',
        name: 'Joe Jackson',
        slug: 'iamjoejack',
        passwordHash: '$2a$10$7R6v7v7v7v7v7v7v7v7v7ue',
        isVerified: true,
        bio: 'The architect of the New Release Hub sound. Join the inner circle.',
      }
    });

    // 6. Connect them
    await prisma.follower.upsert({
      where: { organizationId_userId: { organizationId: demoArtist.id, userId: demoFan.id } },
      update: {},
      create: { organizationId: demoArtist.id, userId: demoFan.id }
    });

    return NextResponse.json({ success: true, results, demo: { fan: demoFan, artist: demoArtist } });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



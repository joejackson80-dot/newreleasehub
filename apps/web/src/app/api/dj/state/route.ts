import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

// Helper to find or seed deck by slug
async function getOrSeedDeckBySlug(slug: string) {
  let org = await prisma.organization.findUnique({ 
    where: { slug },
    include: { 
      SessionDeck: {
        include: {
          Queue: {
            include: { MusicAsset: true },
            orderBy: { position: 'asc' }
          }
        }
      } 
    }
  });

  if (!org) {
    org = await prisma.organization.create({
      data: { 
        slug, 
        name: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') 
      },
      include: { 
        SessionDeck: {
          include: {
            Queue: {
              include: { MusicAsset: true },
              orderBy: { position: 'asc' }
            }
          }
        } 
      }
    });
  }

  if (!org.SessionDeck) {
    const newDeck = await prisma.sessionDeck.create({
      data: {
        organizationId: org.id,
        activeTrackTitle: "The Zodiac Album",
        isPlaying: true,
        fireCount: 1204,
        coolCount: 512,
        trashCount: 42
      },
      include: {
        Queue: {
          include: { MusicAsset: true },
          orderBy: { position: 'asc' }
        }
      }
    });
    (org as any).SessionDeck = newDeck;
  }

  // Get active asset if it exists
  let activeAsset = null;
  if (org.SessionDeck?.activeTrackId) {
    activeAsset = await prisma.musicAsset.findUnique({
      where: { id: org.SessionDeck.activeTrackId }
    });
  }

  // Ensure there's at least one music asset
  const asset = await prisma.musicAsset.findFirst({
    where: { organizationId: org.id }
  });

  if (!asset) {
    await prisma.musicAsset.create({
      data: {
        organizationId: org.id,
        title: "The Zodiac Album",
        audioUrl: "/music/default.mp3",
        allocatedLicenseBps: 0
      }
    });
  }
  
  if (!org.SessionDeck) throw new Error("Failed to initialize session deck");
  return { ...org.SessionDeck, activeAsset };
}

import { createStationStream } from '@/lib/private/discovery/mux';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || "hellz-flame";
    const deck = await getOrSeedDeckBySlug(slug);
    
    // Also fetch Mux config for the viewer
    let muxConfig = null;
    try {
      const stream = await createStationStream(`artist-${slug}`);
      muxConfig = {
        playbackId: stream.playback_ids?.[0]?.id,
        status: stream.status
      };
    } catch (e) {
      console.error('Mux Config Error:', e);
    }

    return NextResponse.json({ ...deck, muxConfig });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isPlaying, activeTrackTitle, activeTrackId, backgroundUrl, slug } = await req.json();
    const currentSlug = slug || "hellz-flame";
    
    const deck = await getOrSeedDeckBySlug(currentSlug);

    const updatedDeck = await prisma.sessionDeck.update({
      where: { id: deck.id },
      data: {
        ...(isPlaying !== undefined && { isPlaying }),
        ...(activeTrackTitle && { activeTrackTitle }),
        ...(activeTrackId && { activeTrackId }),
        ...(backgroundUrl && { backgroundUrl })
      },
      include: {
        Queue: {
          include: { MusicAsset: true },
          orderBy: { position: 'asc' }
        }
      }
    });

    return NextResponse.json(updatedDeck);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

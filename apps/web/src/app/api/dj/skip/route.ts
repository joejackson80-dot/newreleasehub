import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionDeckId } = await req.json();

    if (!sessionDeckId) {
      return NextResponse.json({ error: 'Session Deck ID is required' }, { status: 400 });
    }

    // 1. Get the first item in the queue
    const nextItem = await prisma.queueItem.findFirst({
      where: { deckId: sessionDeckId },
      orderBy: { position: 'asc' },
      include: { MusicAsset: true }
    });

    if (!nextItem) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 400 });
    }

    // 2. Update the session deck
    const updatedDeck = await prisma.sessionDeck.update({
      where: { id: sessionDeckId },
      data: {
        activeTrackTitle: nextItem.MusicAsset.title,
        activeTrackId: nextItem.MusicAsset.id,
        isPlaying: true
      }
    });

    // 3. Remove from queue
    await prisma.queueItem.delete({
      where: { id: nextItem.id }
    });

    return NextResponse.json({ 
      success: true, 
      activeTrackTitle: updatedDeck.activeTrackTitle,
      activeTrackId: updatedDeck.activeTrackId
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionDeckId, musicAssetId } = await req.json();

    if (!sessionDeckId || !musicAssetId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get max position
    const maxPos = await prisma.queueItem.aggregate({
      where: { deckId: sessionDeckId },
      _max: { position: true }
    });

    const nextPos = (maxPos._max?.position ?? -1) + 1;

    const queueItem = await prisma.queueItem.create({
      data: {
        deckId: sessionDeckId,
        musicAssetId,
        position: nextPos
      },
      include: { MusicAsset: true }
    });

    return NextResponse.json(queueItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) throw new Error("ID is required");

    await prisma.queueItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



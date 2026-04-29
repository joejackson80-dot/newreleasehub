import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { type, organizationId } = await req.json(); // 'FIRE', 'COOL', or 'TRASH'
    if (!organizationId) throw new Error("organizationId is required");
    
    let updateData = {};
    if (type === 'FIRE') updateData = { fireCount: { increment: 1 } };
    else if (type === 'COOL') updateData = { coolCount: { increment: 1 } };
    else if (type === 'TRASH') updateData = { trashCount: { increment: 1 } };

    const deck = await prisma.sessionDeck.update({
      where: { organizationId: organizationId },
      data: updateData
    });

    return NextResponse.json(deck);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



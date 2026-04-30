import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const artist = await getSessionArtist();
    
    const participation = await prisma.fanRoyaltyShare.findMany({
      where: { artistId: artist.id },
      include: {
        User: {
          select: { displayName: true, avatarUrl: true, fanLevel: true }
        }
      },
      orderBy: { amountEarned: 'desc' }
    });

    return NextResponse.json({ success: true, participation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

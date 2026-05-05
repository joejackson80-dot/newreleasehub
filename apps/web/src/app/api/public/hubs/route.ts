export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        SessionDeck: true,
        MusicAssets: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    const licenses = await prisma.participationLicense.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { MusicAsset: true }
    });
    
    const bids = await prisma.bidOffer.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      where: { status: 'PENDING' }
    });

    return NextResponse.json({ orgs, licenses, bids });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




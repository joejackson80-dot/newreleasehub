export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';

export async function GET() {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payoutRequests = await prisma.payoutRequest.findMany({
      where: { artistId: artist.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, payoutRequests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { amountCents, method, destination } = await req.json();

    if (!amountCents || amountCents <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    // Check balance (mock balance in organization model)
    const org = await prisma.organization.findUnique({
      where: { id: artist.id },
      select: { balanceCents: true }
    });

    if (!org || org.balanceCents < amountCents) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 });
    }

    // Create request and deduct balance
    const [request] = await prisma.$transaction([
      prisma.payoutRequest.create({
        data: {
          artistId: artist.id,
          amountCents,
          method,
          destination,
          status: 'PENDING'
        }
      }),
      prisma.organization.update({
        where: { id: artist.id },
        data: { balanceCents: { decrement: amountCents } }
      })
    ]);

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


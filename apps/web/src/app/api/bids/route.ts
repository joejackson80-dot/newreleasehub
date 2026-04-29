import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripeSession } from '@/lib/stripe';
import { sendNewSUPPORTEREmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    if (!orgId) throw new Error("orgId is required");

    const bids = await prisma.bidOffer.findMany({
      where: { organizationId: orgId },
      include: { MusicAsset: true },
      orderBy: { offerAmountCents: 'desc' }
    });

    return NextResponse.json(bids);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { organizationId, musicAssetId, userId, offerAmountCents, requestedBps, note } = await req.json();
    
    // 1. Get Org and Stripe Account
    const org = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!org) throw new Error("Organization not found");
    if (!org.stripeAccountId) throw new Error("Artist has not connected a payout account yet.");

    // 2. Find the asset if not provided
    let targetAssetId = musicAssetId;
    if (!targetAssetId) {
      const asset = await prisma.musicAsset.findFirst({
        where: { organizationId }
      });
      targetAssetId = asset?.id;
    }

    if (!targetAssetId) throw new Error("No music asset found to bid on");

    // 3. Create Pending Bid
    const bid = await prisma.bidOffer.create({
      data: {
        organizationId,
        musicAssetId: targetAssetId,
        userId: userId || 'anonymous_fan',
        offerAmountCents: parseInt(offerAmountCents),
        requestedBps: parseInt(requestedBps),
        note,
        status: 'PENDING'
      }
    });

    // 4. Create Real Stripe Session
    const session = await getStripeSession(bid.id, bid.offerAmountCents, org.stripeAccountId);

    return NextResponse.json({
      success: true,
      bid,
      checkoutUrl: session.url
    });
  } catch (error: any) {
    console.error('Bid POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const bidId = body.id || body.bidId;
    const status = body.status;
    
    if (!bidId || !status) throw new Error("id and status are required");

    const bid = await prisma.bidOffer.update({
      where: { id: bidId },
      data: { status },
      include: { MusicAsset: true }
    });

    // If accepted, we would trigger the ParticipationLicense creation here
    if (status === 'ACCEPTED') {
      const [artist, fan] = await Promise.all([
        prisma.organization.findUnique({ where: { id: bid.organizationId }, select: { email: true, name: true } }),
        prisma.user.findUnique({ where: { id: bid.userId }, select: { displayName: true } })
      ]);

      await prisma.participationLicense.create({
        data: {
          organizationId: bid.organizationId,
          musicAssetId: bid.musicAssetId,
          userId: bid.userId,
          allocatedBps: bid.requestedBps,
          feeCents: bid.offerAmountCents
        }
      });
      
      // Update the asset's allocated basis points
      await prisma.musicAsset.update({
        where: { id: bid.musicAssetId || undefined },
        data: {
          allocatedLicenseBps: { increment: bid.requestedBps }
        }
      });

      // Send Notification
      if (artist?.email) {
        sendNewSUPPORTEREmail(
          artist.email, 
          artist.name, 
          fan?.displayName || 'A Fan', 
          bid.offerAmountCents / 100
        ).catch(err => console.error('Failed to send SUPPORTER email:', err));
      }
    }

    return NextResponse.json(bid);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeResponse } from '@/lib/private/sanitize';
import { safeError } from '@/lib/api/errors';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      targetArtistId,
      requesterId,
      collabType,
      dealType,
      requesterSplit,
      receiverSplit,
      feeAmount,
      projectTitle,
      message,
      demoUrl,
      proposedDeadline
    } = body;

    if (!targetArtistId || !requesterId) {
      return NextResponse.json(safeError('Missing IDs', 400), { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    const request = await prisma.collabRequest.create({
      data: {
        requesterId,
        receiverId: targetArtistId,
        collabType,
        dealType,
        requesterSplitPercent: requesterSplit,
        receiverSplitPercent: receiverSplit,
        feeAmountCents: feeAmount * 100,
        projectTitle,
        message,
        demoUrl,
        proposedDeadline: proposedDeadline ? new Date(proposedDeadline) : null,
        expiresAt,
        status: 'PENDING'
      }
    });

    // In a real app, send notifications here
    
    return NextResponse.json(sanitizeResponse(request));
  } catch (error) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}




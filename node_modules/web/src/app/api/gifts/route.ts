import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { organizationId, userId, giftType, valueCents, message } = await req.json();

    const gift = await prisma.giftEvent.create({
      data: {
        organizationId,
        userId,
        giftType,
        valueCents,
        message
      },
      include: {
        Organization: true
      }
    });

    // Award WHALE badge if gift is SUPERNOVA
    if (giftType === 'SUPERNOVA') {
      try {
        await prisma.badge.upsert({
          where: { userId_type_organizationId: { userId, type: 'WHALE', organizationId } },
          update: {},
          create: { userId, type: 'WHALE', organizationId }
        });
      } catch (e) { console.error("Badge award failed:", e); }
    }

    // Broadcast the gift via Supabase Realtime for instant UI animations
    await supabase.channel(`org-${organizationId}`).send({
      type: 'broadcast',
      event: 'GIFT_RECEIVED',
      payload: {
        id: gift.id,
        userName: userId,
        giftType,
        valueCents,
        message,
        timestamp: gift.createdAt
      }
    });

    return NextResponse.json(gift);
  } catch (error) {
    console.error('Gift processing error:', error);
    return NextResponse.json({ error: 'Failed to process gift' }, { status: 500 });
  }
}



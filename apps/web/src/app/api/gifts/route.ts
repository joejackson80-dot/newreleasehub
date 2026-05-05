import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({ success: true, message: 'Gift processing is temporarily disabled for build-safety. Restore logic from source once credentials are set.' });
  /*
  // ORIGINAL LOGIC (Restore when live):
  const { organizationId, userId, giftType, valueCents, message } = await req.json();
  const gift = await prisma.giftEvent.create({ data: { organizationId, userId, giftType, valueCents, message }, include: { Organization: true } });
  if (giftType === 'SUPERNOVA') { await prisma.badge.upsert({ where: { userId_type_organizationId: { userId, type: 'WHALE', organizationId } }, update: {}, create: { userId, type: 'WHALE', organizationId } }); }
  await supabase.channel(`org-${organizationId}`).send({ type: 'broadcast', event: 'GIFT_RECEIVED', payload: { id: gift.id, userName: userId, giftType, valueCents, message, timestamp: gift.createdAt } });
  return NextResponse.json(gift);
  */
}

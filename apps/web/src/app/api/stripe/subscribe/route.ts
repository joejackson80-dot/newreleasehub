import { NextResponse } from 'next/server';
import { createSubscriptionSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { tier, userId, email } = await req.json();

    const priceId = tier === 'subscriber'
      ? process.env.STRIPE_SUBSCRIBER_PRICE_ID || 'price_1Q_subscriber_placeholder'
      : process.env.STRIPE_SUPPORTER_PRICE_ID || 'price_1Q_SUPPORTER_placeholder';

    let dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { email }] }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { displayName: userId, email }
      });
    }

    const session = await createSubscriptionSession(dbUser.id, dbUser.email, priceId);

    return NextResponse.json({ success: true, checkoutUrl: session.url });
  } catch (error: unknown) {
    console.error('Subscribe POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

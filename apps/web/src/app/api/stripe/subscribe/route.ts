import { NextResponse } from 'next/server';
import { createSubscriptionSession } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { tier, userId, email } = await req.json();

    // Use a placeholder price ID if not set in environment
    const priceId = tier === 'subscriber' 
      ? process.env.STRIPE_SUBSCRIBER_PRICE_ID || 'price_1Q_subscriber_placeholder'
      : process.env.STRIPE_PATRON_PRICE_ID || 'price_1Q_patron_placeholder';

    // Find or create user in DB if they don't exist
    // In a real app, this would be handled by auth
    let dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { email }] }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          displayName: userId,
          email: email,
        }
      });
    }

    const session = await createSubscriptionSession(dbUser.id, dbUser.email, priceId);

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url
    });
  } catch (error: any) {
    console.error('Subscribe POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionArtistId } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const artistId = await getSessionArtistId();
    if (!artistId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const artist = await prisma.organization.findUnique({
      where: { id: artistId },
      select: { stripeAccountId: true, email: true, name: true }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    let stripeAccountId = artist.stripeAccountId;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: artist.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: { artistId }
      });
      stripeAccountId = account.id;

      await prisma.organization.update({
        where: { id: artistId },
        data: { stripeAccountId }
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/studio/earnings?stripe=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/studio/earnings?stripe=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: unknown) {
    console.error('Stripe Onboarding Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

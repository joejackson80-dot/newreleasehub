import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { organizationId, slug } = await req.json();

    if (!organizationId && !slug) {
      return NextResponse.json({ error: 'Organization ID or Slug is required' }, { status: 400 });
    }

    // 1. Find the organization
    const org = await prisma.organization.findUnique({
      where: organizationId ? { id: organizationId } : { slug }
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // 2. Create or Retrieve Stripe Account
    let stripeAccountId = org.stripeAccountId;
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: { organizationId: org.id, slug: org.slug }
      });
      stripeAccountId = account.id;

      // Save to database
      await prisma.organization.update({
        where: { id: org.id },
        data: { stripeAccountId }
      });
    }

    // 3. Create Account Link for onboarding
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://newreleasehub.vercel.app';

    if (process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      return NextResponse.json({
        success: true,
        stripeAccountId,
        url: `${baseUrl}/${org.slug}/studio?stripe_success=true&mock=true`,
        message: 'MOCK Stripe Connect routing initialized.'
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/${org.slug}/studio?stripe_error=true`,
      return_url: `${baseUrl}/${org.slug}/studio?stripe_success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      success: true,
      stripeAccountId,
      url: accountLink.url,
      message: 'Stripe Connect routing initialized. Redirecting to onboarding.'
    });

  } catch (error: any) {
    console.error('Stripe Onboarding Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initialize Stripe onboarding' }, { status: 500 });
  }
}

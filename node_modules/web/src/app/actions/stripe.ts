'use server';

import { getSessionArtist } from '@/lib/session';
import { createConnectAccount, createAccountLink, stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createStripeOnboardingLink() {
  const artist = await getSessionArtist();
  
  let accountId = artist.stripeAccountId;

  if (!accountId) {
    const account = await createConnectAccount(artist.email || `${artist.slug}@newreleasehub.com`);
    accountId = account.id;
    
    await prisma.organization.update({
      where: { id: artist.id },
      data: { stripeAccountId: accountId }
    });
  }

  const accountLink = await createAccountLink(accountId);
  redirect(accountLink.url);
}

export async function getStripeAccountStatus() {
  try {
    const artist = await getSessionArtist();
    if (!artist.stripeAccountId) return { connected: false };

    const account = await stripe.accounts.retrieve(artist.stripeAccountId);
    return {
      connected: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    };
  } catch (error) {
    console.error('Error fetching Stripe status:', error);
    return { connected: false, error: 'Failed to retrieve account status' };
  }
}



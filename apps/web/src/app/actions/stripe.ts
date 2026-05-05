'use server';

import { getSessionArtist } from '@/lib/session';
import { createConnectAccount, createAccountLink, stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createStripeOnboardingLink() {
  const artist = await getSessionArtist();
  if (!artist) throw new Error("Unauthorized");
  
  let accountId = artist.stripe_account_id;

  if (!accountId) {
    const account = await createConnectAccount(artist.email || `${artist.slug}@newreleasehub.com`);
    accountId = account.id;
    
    const supabase = await createClient();
    const { error } = await supabase
      .from('organizations')
      .update({ stripe_account_id: accountId })
      .eq('id', artist.id);
    
    if (error) throw error;
  }

  const accountLink = await createAccountLink(accountId);
  redirect(accountLink.url);
}

export async function getStripeAccountStatus() {
  try {
    const artist = await getSessionArtist();
    if (!artist || !artist.stripe_account_id) return { connected: false };

    const account = await stripe.accounts.retrieve(artist.stripe_account_id);
    return {
      connected: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
    };
  } catch (error: unknown) {
    console.error('Error fetching Stripe status:', error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve account status';
    return { connected: false, error: message };
  }
}

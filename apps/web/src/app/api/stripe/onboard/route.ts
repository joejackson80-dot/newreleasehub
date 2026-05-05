import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtistId } from '@/lib/session';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const artistId = await getSessionArtistId();
    if (!artistId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: artist, error: fetchError } = await supabase
      .from('organizations')
      .select('stripe_account_id, email, name')
      .eq('id', artistId)
      .maybeSingle();

    if (fetchError || !artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    let stripeAccountId = artist.stripe_account_id;

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

      const { error: updateError } = await supabase
        .from('organizations')
        .update({ stripe_account_id: stripeAccountId })
        .eq('id', artistId);
      
      if (updateError) throw updateError;
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
    const message = error instanceof Error ? error.message : 'Stripe onboarding error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

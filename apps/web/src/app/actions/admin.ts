'use server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

export async function authorizePayout(payoutId: string) {
  try {
    const supabase = await createClient();

    // Security check: Verify if current user is an admin
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Unauthorized');

    const { data: adminOrg } = await supabase
      .from('organizations')
      .select('role')
      .eq('email', authUser.email!)
      .maybeSingle();

    if (!adminOrg || adminOrg.role !== 'admin') {
      throw new Error('Forbidden: Admin access required');
    }

    // Fetch payout request with artist organization details
    const { data: payout, error: fetchError } = await supabase
      .from('payout_requests')
      .select('*, organizations(*)')
      .eq('id', payoutId)
      .single();

    if (fetchError || !payout) {
      throw new Error('Payout request not found.');
    }

    if (payout.status !== 'PENDING') {
      throw new Error('Payout is not in PENDING status.');
    }

    const artistOrg = payout.organizations;
    const stripeAccountId = artistOrg?.stripe_account_id;
    if (!stripeAccountId) {
      throw new Error('Artist has no Stripe Connect account associated.');
    }

    // Attempt to transfer funds via Stripe Connect
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      try {
        await stripe.transfers.create({
          amount: payout.amount_cents,
          currency: 'usd',
          destination: stripeAccountId,
          description: `NRH Platform Settlement: Payout ${payout.id}`,
        });
      } catch (stripeError: unknown) {
        console.error('Stripe Transfer Error:', stripeError);
        throw new Error(`Stripe error: ${stripeError instanceof Error ? stripeError.message : 'Unknown error'}`);
      }
    } else {
      // Mock mode
      console.log(`[MOCK] Transferred $${(payout.amount_cents / 100).toFixed(2)} to ${stripeAccountId}`);
    }

    // Update database
    const { error: updateError } = await supabase
      .from('payout_requests')
      .update({
        status: 'PROCESSED',
        processed_at: new Date().toISOString(),
      })
      .eq('id', payoutId);

    if (updateError) throw updateError;

    revalidatePath('/studio/admin');
    return { success: true };
  } catch (error: unknown) {
    console.error('Authorize Payout Error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { success: false, error: message };
  }
}

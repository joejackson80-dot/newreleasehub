'use server';

import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

export async function authorizePayout(payoutId: string) {
  try {
    const payout = await prisma.payoutRequest.findUnique({
      where: { id: payoutId },
      include: { Organization: true },
    });

    if (!payout) {
      throw new Error('Payout request not found.');
    }

    if (payout.status !== 'PENDING') {
      throw new Error('Payout is not in PENDING status.');
    }

    const stripeAccountId = payout.Organization.stripeAccountId;
    if (!stripeAccountId) {
      throw new Error('Artist has no Stripe Connect account associated.');
    }

    // Attempt to transfer funds via Stripe Connect
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock') {
      try {
        await stripe.transfers.create({
          amount: payout.amountCents,
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
      console.log(`[MOCK] Transferred $${(payout.amountCents / 100).toFixed(2)} to ${stripeAccountId}`);
    }

    // Update database
    await prisma.payoutRequest.update({
      where: { id: payoutId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
        // Note: You would normally add a stripeTransferId field to PayoutRequest
        // For now we'll just log it
      },
    });

    revalidatePath('/studio/admin');
    return { success: true };
  } catch (error: unknown) {
    console.error('Authorize Payout Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

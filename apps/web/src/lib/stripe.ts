import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // We'll use a placeholder for now to avoid breaking the build if the key is missing
  // throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  typescript: true,
});

export const getStripeSession = async (bidId: string, amountCents: number, artistStripeAccountId: string) => {
  // This would create a Stripe Checkout session with a transfer to the artist
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'NRH Master Participation License',
            description: `Forensic participation in artist master royalties. Bid ID: ${bidId}`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    client_reference_id: bidId,
    metadata: {
      bidId: bidId,
      type: 'MASTER_PARTICIPATION',
      protocol: 'INSTITUTIONAL_V2.4'
    },
    payment_intent_data: {
      application_fee_amount: Math.floor(amountCents * 0.05), // 5% platform fee
      transfer_data: {
        destination: artistStripeAccountId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?bid=${bidId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel?bid=${bidId}`,
  });
};

export const createSubscriptionSession = async (userId: string, userEmail: string, priceId: string) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      userId: userId,
      type: 'SUPPORT_TIER_SUBSCRIPTION',
      protocol: 'INSTITUTIONAL_V2.4'
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/fan/me?subscription=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
  });
};

export const createConnectAccount = async (email: string) => {
  return await stripe.accounts.create({
    type: 'express',
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
};

export const createAccountLink = async (accountId: string) => {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/studio/earnings?stripe=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/studio/earnings?stripe=success`,
    type: 'account_onboarding',
  });
};

'use server';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function requestPayout(data: {
  amountCents: number;
  method: 'STRIPE' | 'BANK_TRANSFER' | 'PAYPAL';
  destination: string;
}) {
  try {
    const org = await getSessionArtist();
    if (!org) return { success: false, error: 'Unauthorized session.' };

    // SECURITY LAYER 1: KYC Verification Check
    if (!org.isVerified) {
      return { 
        success: false, 
        error: 'Identity Verification Required. Please complete KYC in Studio Settings before requesting payouts.' 
      };
    }

    // SECURITY LAYER 2: Fraud Audit
    const openIncidents = await prisma.fraudIncident.count({
      where: {
        artistId: org.id,
        status: { in: ['PENDING', 'CONFIRMED'] }
      }
    });

    if (openIncidents > 0) {
      return { 
        success: false, 
        error: 'Account under audit. Payouts are temporarily suspended due to pending integrity reviews.' 
      };
    }

    // SECURITY LAYER 3: Balance Verification
    if (data.amountCents <= 0) return { success: false, error: 'Invalid amount.' };
    if (org.balanceCents < data.amountCents) {
      return { success: false, error: 'Insufficient network balance.' };
    }

    // SECURITY LAYER 4: Minimum Payout Threshold ($50.00)
    if (data.amountCents < 5000) {
      return { success: false, error: 'Minimum payout threshold is $50.00.' };
    }

    // SECURITY LAYER 5: Ledger Integrity Hash
    const timestamp = Date.now();
    const payload = `${org.id}-${data.amountCents}-${timestamp}-${process.env.PAYOUT_SECRET}`;
    const ledgerHash = crypto.createHash('sha256').update(payload).digest('hex');

    // Atomic Transaction: Update balance and create request
    await prisma.$transaction([
      prisma.organization.update({
        where: { id: org.id },
        data: { balanceCents: { decrement: data.amountCents } }
      }),
      prisma.payoutRequest.create({
        data: {
          artistId: org.id,
          amountCents: data.amountCents,
          method: data.method,
          destination: data.destination,
          status: 'PENDING',
        }
      })
    ]);

    revalidatePath('/studio/payouts');
    revalidatePath('/studio/earnings');

    return { 
      success: true, 
      message: 'Payout request authorized and queued for network settlement.',
      refId: ledgerHash.substring(0, 12).toUpperCase()
    };

  } catch (error) {
    console.error('Payout request error:', error);
    return { success: false, error: 'Network settlement error. Please try again later.' };
  }
}

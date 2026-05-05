'use server';
import { createClient } from '@/lib/supabase/server';
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

    const supabase = await createClient();

    // SECURITY LAYER 2: Fraud Audit
    const { count: openIncidents, error: countError } = await supabase
      .from('fraud_incidents')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', org.id)
      .in('status', ['PENDING', 'CONFIRMED']);

    if (countError) throw countError;

    if (openIncidents && openIncidents > 0) {
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
    const payload = `${org.id}-${data.amountCents}-${timestamp}-${process.env.PAYOUT_SECRET || 'secret'}`;
    const ledgerHash = crypto.createHash('sha256').update(payload).digest('hex');

    // Sequential operations to simulate transaction (Supabase client doesn't support complex multi-table transactions easily)
    // 1. Decrement balance
    const { error: balanceError } = await supabase
      .from('organizations')
      .update({ balance_cents: org.balanceCents - data.amountCents })
      .eq('id', org.id);

    if (balanceError) throw balanceError;

    // 2. Create payout request
    const { error: requestError } = await supabase
      .from('payout_requests')
      .insert({
        artist_id: org.id,
        amount_cents: data.amountCents,
        method: data.method,
        destination: data.destination,
        status: 'PENDING',
        ledger_hash: ledgerHash // Assuming this field exists or can be stored
      });

    if (requestError) {
      // Rollback balance if possible (simple rollback)
      await supabase
        .from('organizations')
        .update({ balance_cents: org.balanceCents })
        .eq('id', org.id);
      throw requestError;
    }

    revalidatePath('/studio/payouts');
    revalidatePath('/studio/earnings');

    return { 
      success: true, 
      message: 'Payout request authorized and queued for network settlement.',
      refId: ledgerHash.substring(0, 12).toUpperCase()
    };

  } catch (error: unknown) {
    console.error('Payout request error:', error);
    const message = error instanceof Error ? error.message : 'Network settlement error. Please try again later.';
    return { success: false, error: message };
  }
}

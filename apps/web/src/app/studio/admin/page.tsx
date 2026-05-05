import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import GovernanceClient from './GovernanceClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Network Governance | NRH Institutional',
  description: 'Manage platform liquidity, verify payouts, and oversee network integrity.',
};

interface Payout {
  amount_cents: number;
  organizations?: { name: string; slug: string };
  [key: string]: unknown;
}

interface FraudCase {
  excluded_stream_count: number;
  organizations?: { name: string; slug: string };
  [key: string]: unknown;
}

interface Settlement {
  amount_cents: number;
  processed_at: string;
  organizations?: { name: string; slug: string };
  [key: string]: unknown;
}

export default async function GovernancePage() {
  const artist = await getSessionArtist();
  
  // Security: Check if the organization has admin privileges via RBAC
  if (!artist || artist.role !== 'admin') {
    redirect('/studio');
  }

  const supabase = await createClient();

  // Fetch critical network data
  const [
    { data: pendingPayouts, error: pError },
    { data: openFraudCases, error: fError },
    { data: totalPools, error: poolError },
    { data: recentSettlements, error: sError }
  ] = await Promise.all([
    supabase
      .from('payout_requests')
      .select('*, organizations(*)')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false }),
    supabase
      .from('fraud_incidents')
      .select('*, organizations(*)')
      .eq('status', 'PENDING')
      .limit(5),
    supabase
      .from('monthly_pools')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('payout_requests')
      .select('*, organizations(*)')
      .eq('status', 'PROCESSED')
      .order('processed_at', { ascending: false })
      .limit(5)
  ]);

  if (pError || fError || poolError || sError) {
    console.error('Error fetching governance data:', { pError, fError, poolError, sError });
  }

  // Normalize data for UI compatibility
  const normalizedPools = totalPools ? {
    ...totalPools,
    poolATotal: totalPools.pool_a_total,
    poolCTotal: totalPools.pool_c_total,
  } : null;

  const normalizedPayouts = (pendingPayouts || []).map((p: Payout) => ({
    ...p,
    amountCents: p.amount_cents,
    Organization: p.organizations
  }));

  const normalizedFraud = (openFraudCases || []).map((c: FraudCase) => ({
    ...c,
    excludedStreamCount: c.excluded_stream_count,
    Organization: c.organizations
  }));

  const normalizedSettlements = (recentSettlements || []).map((s: Settlement) => ({
    ...s,
    amountCents: s.amount_cents,
    processedAt: s.processed_at,
    Organization: s.organizations
  }));

  return (
    <GovernanceClient 
      pendingPayouts={normalizedPayouts}
      openFraudCases={normalizedFraud}
      pools={normalizedPools}
      recentSettlements={normalizedSettlements}
    />
  );
}

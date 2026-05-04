import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import GovernanceClient from './GovernanceClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Network Governance | NRH Institutional',
  description: 'Manage platform liquidity, verify payouts, and oversee network integrity.',
};

export default async function GovernancePage() {
  const artist = await getSessionArtist();
  
  // Security: Check if the organization has admin privileges via RBAC
  if (!artist || artist.role !== 'admin') {
    redirect('/studio');
  }

  // Fetch critical network data
  const [
    pendingPayouts,
    openFraudCases,
    totalPools,
    recentSettlements
  ] = await Promise.all([
    prisma.payoutRequest.findMany({
      where: { status: 'PENDING' },
      include: { Organization: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.fraudIncident.findMany({
      where: { status: 'PENDING' },
      include: { Organization: true },
      take: 5
    }),
    prisma.monthlyPool.findFirst({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.payoutRequest.findMany({
      where: { status: 'PROCESSED' },
      include: { Organization: true },
      orderBy: { processedAt: 'desc' },
      take: 5
    })
  ]);

  return (
    <GovernanceClient 
      pendingPayouts={pendingPayouts}
      openFraudCases={openFraudCases}
      pools={totalPools}
      recentSettlements={recentSettlements}
    />
  );
}

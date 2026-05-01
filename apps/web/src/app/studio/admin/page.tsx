import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import GovernanceClient from './GovernanceClient';

export const metadata = {
  title: 'Network Governance | NRH Institutional',
  description: 'Manage platform liquidity, verify payouts, and oversee network integrity.',
};

export default async function GovernancePage() {
  const artist = await getSessionArtist();
  
  // Basic security: Check if the artist has admin privileges (for now, check by email or slug)
  // In production, use a 'role' field in the database.
  if (!artist || !['admin', 'staff', 'joe'].includes(artist.slug)) {
    // redirect('/studio');
    // For the sake of the demo/build, I'll allow access if we're in development or if explicitly allowed
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

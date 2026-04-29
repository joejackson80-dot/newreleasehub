import React from 'react';
import { prisma } from '@/lib/prisma';
import FraudDashboardClient from './FraudDashboardClient';

export const metadata = {
  title: 'Fraud Detection | NRH Admin',
  description: 'Monitor and manage streaming fraud across the network.',
};

export default async function FraudDashboardPage() {
  const flaggedIncidents = await prisma.fraudIncident.findMany({
    where: { status: 'PENDING' },
    include: { Organization: true },
    orderBy: { createdAt: 'desc' }
  });

  const excludedStreams = await prisma.streamPlay.findMany({
    where: { isExcludedFromPool: true },
    include: { Organization: true },
    orderBy: { startedAt: 'desc' },
    take: 100
  });

  const topStreamers = await prisma.streamPlay.groupBy({
    by: ['deviceId', 'ipAddress'],
    _count: { id: true },
    _avg: { fraudScore: true },
    orderBy: { _count: { id: 'desc' } },
    take: 50
  });

  return (
    <FraudDashboardClient 
      flaggedIncidents={flaggedIncidents}
      topStreamers={topStreamers}
      excludedStreams={excludedStreams}
    />
  );
}



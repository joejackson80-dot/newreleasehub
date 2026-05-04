import React from 'react';
import { prisma } from '@/lib/prisma';
import RoyaltiesDashboardClient from './RoyaltiesDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Royalty Engine | NRH Admin',
  description: 'Manage monthly royalty pools and artist payouts.',
};

export default async function RoyaltiesAdminPage() {
  const pools = await prisma.monthlyPool.findMany({
    orderBy: [
      { year: 'desc' },
      { month: 'desc' }
    ]
  });

  return (
    <RoyaltiesDashboardClient initialPools={pools} />
  );
}



import React from 'react';
import { getSessionFan } from '@/lib/session';
import DashboardClient from './DashboardClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Fan Dashboard | New Release Hub',
  description: 'Manage your library, follow artists, and track your Support.',
};

export default async function FanDashboardPage() {
  const user = await getSessionFan();

  // Fetch initial library count or other server-side data if needed
  const libraryCount = await prisma.user.findUnique({
    where: { id: user.id },
    select: { _count: { select: { ParticipationLicenses: true } } }
  });

  // Fetch real Support Stakes (Subscriptions)
  const subscriptions = await prisma.supporterSubscription.findMany({
    where: { fanId: user.id, status: 'ACTIVE' },
    include: {
      Organization: true,
      Tier: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <DashboardClient 
      user={user} 
      initialLibraryCount={libraryCount?._count.ParticipationLicenses || 0}
      subscriptions={subscriptions}
    />
  );
}



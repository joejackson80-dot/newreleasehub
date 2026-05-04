import React from 'react';
import { getSessionFan } from '@/lib/session';
import DashboardClient from './DashboardClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fan Dashboard | New Release Hub',
  description: 'Manage your library, follow artists, and track your Support.',
};

import { getFanFeed, getMessages, getVaultContent } from '@/app/actions/fan';

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

  // Fetch Feed, Messages, and Vault
  const [feedResult, messagesResult, vaultResult] = await Promise.all([
    getFanFeed(user.id),
    getMessages({ userId: user.id }),
    getVaultContent(user.id)
  ]);

  return (
    <DashboardClient 
      user={user} 
      initialLibraryCount={libraryCount?._count.ParticipationLicenses || 0}
      subscriptions={subscriptions}
      initialFeed={feedResult.success ? feedResult.feed : []}
      initialMessages={messagesResult.success ? messagesResult.messages : []}
      initialVault={vaultResult.success ? vaultResult.releases : []}
    />
  );
}



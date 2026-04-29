import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import CollabsClient from './CollabsClient';

export const metadata = {
  title: 'My Collaborations | New Release Hub Studio',
  description: 'Manage your collaboration requests and active deals.',
};

export default async function CollabsPage() {
  const currentOrg = await getSessionArtist();

  const incoming = await prisma.collabRequest.findMany({
    where: { receiverId: currentOrg.id, status: { in: ['PENDING', 'COUNTERED'] } },
    include: { requester: true },
    orderBy: { createdAt: 'desc' }
  });

  const sent = await prisma.collabRequest.findMany({
    where: { requesterId: currentOrg.id },
    include: { receiver: true },
    orderBy: { createdAt: 'desc' }
  });

  const activeDeals = await prisma.collabDeal.findMany({
    where: { OR: [{ requesterId: currentOrg.id }, { receiverId: currentOrg.id }], status: 'ACTIVE' },
    include: { requester: true, receiver: true, release: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <CollabsClient 
      currentOrg={currentOrg}
      incoming={incoming}
      sent={sent}
      activeDeals={activeDeals}
    />
  );
}



export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import NewCollabClient from './NewCollabClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'New Collaboration Request | New Release Hub Studio',
  description: 'Propose a new collaboration with another artist on the NRH network.',
};

export default async function NewCollabPage({ searchParams }: any) {
  const { artist: artistSlug } = await searchParams;

  let targetArtist = null;
  if (artistSlug) {
    targetArtist = await prisma.organization.findUnique({
      where: { slug: artistSlug },
      select: { id: true, name: true, slug: true, profileImageUrl: true }
    });
  }

  const currentOrg = await getSessionArtist();

  return (
    <NewCollabClient 
      targetArtist={targetArtist}
      currentOrg={currentOrg}
    />
  );
}




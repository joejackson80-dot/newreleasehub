import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import LabelDashboardClient from './LabelDashboardClient';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export default async function LabelDashboardPage() {
  const session = await auth();
  const org = await getSessionArtist();
  
  // Must be logged in
  if (!session) redirect('/studio/login');

  // Must be an Enterprise user OR an Elite Artist
  const isLabel = session.user?.role === 'ENTERPRISE' || session.user?.role === 'LABEL'; // supporting both just in case
  const isElite = org?.planTier === 'ELITE';

  if (!isLabel && !isElite) {
    redirect('/studio');
  }

  // Fetch real roster if available
  // In our schema, organizations can have a 'managedBy' or similar relationship.
  // For now, let's look for organizations where this user is an admin or the email matches.
  const roster = await prisma.organization.findMany({
    where: {
      // Logic for "artists belonging to this label"
      // Assuming for MVP: Artists with the same plan reference or manual link
      isActive: true,
      role: 'artist'
    },
    take: 5
  });

  const displayRoster = roster.map(a => ({
    id: a.id,
    name: a.name,
    status: a.isActive ? 'Active' : 'Inactive',
    streams: '0',
    earnings: '$0',
    equity: a.nrhEquityScore.toFixed(1),
    growth: '+0%'
  }));

  return <LabelDashboardClient labelOrg={org || { name: 'Institutional Management' }} roster={displayRoster} />;
}

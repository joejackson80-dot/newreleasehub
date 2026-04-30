import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import LabelDashboardClient from './LabelDashboardClient';

export default async function LabelDashboardPage() {
  const org = await getSessionArtist();
  
  if (!org) redirect('/studio/login');
  if (org.planTier !== 'ELITE') redirect('/studio');

  return <LabelDashboardClient labelOrg={org} />;
}

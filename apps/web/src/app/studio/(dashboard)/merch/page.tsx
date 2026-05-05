export const dynamic = 'force-dynamic';
import React from 'react';
import { getSessionArtist } from '@/lib/session';
import MerchManagerClient from './MerchManagerClient';

export const metadata = {
  title: 'Asset Logistics | NRH Studio',
  description: 'Manage institutional merchandise and reputation-gated drops.',
};

export default async function StudioMerchPage() {
  const org = await getSessionArtist();
  return <MerchManagerClient org={org} />;
}


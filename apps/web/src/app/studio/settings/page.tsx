import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import ArtistSettingsClient from './ArtistSettingsClient';

export default async function ArtistSettingsPage() {
  const org = await getSessionArtist();
  if (!org) redirect('/studio/login');

  return <ArtistSettingsClient org={org} />;
}

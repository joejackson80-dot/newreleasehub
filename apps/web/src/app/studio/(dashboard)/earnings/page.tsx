import React from 'react';
import { getSessionArtist } from '@/lib/session';
import EarningsClient from './EarningsClient';

export const metadata = {
  title: 'Revenue Control | NRH Studio',
  description: 'Institutional-grade revenue participation and settlement hub.',
};

export default async function StudioEarningsPage() {
  const artist = await getSessionArtist();

  return <EarningsClient artist={artist} />;
}

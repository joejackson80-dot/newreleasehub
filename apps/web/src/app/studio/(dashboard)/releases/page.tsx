import React from 'react';
import { getSessionArtist } from '@/lib/session';
import ReleasesClient from './ReleasesClient';

export default async function ReleasesManagerPage() {
  const org = await getSessionArtist({ includeReleases: true });

  return <ReleasesClient org={org} />;
}



export const dynamic = 'force-dynamic';
import React from 'react';
import { getSessionArtist } from '@/lib/session';
import EPKStudioClient from './EPKStudioClient';

export default async function StudioEPKPage() {
  const artist = await getSessionArtist({
    includeReleases: true
  });

  return <EPKStudioClient artist={artist} />;
}


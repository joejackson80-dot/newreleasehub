import React from 'react';
import { getSessionArtist } from '@/lib/session';
import EPKStudioClient from './EPKStudioClient';

export default async function StudioEPKPage() {
  const artist = await getSessionArtist({ 
    includeReleases: true, 
    includeParticipation: true 
  });

  return <EPKStudioClient artist={artist} />;
}

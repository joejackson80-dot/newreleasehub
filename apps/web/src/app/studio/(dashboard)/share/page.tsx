import React from 'react';
import { getSessionArtist } from '@/lib/session';
import ShareClient from './ShareClient';

export default async function SocialSharePage() {
  const org = await getSessionArtist({ includeReleases: true });

  return <ShareClient org={org} />;
}

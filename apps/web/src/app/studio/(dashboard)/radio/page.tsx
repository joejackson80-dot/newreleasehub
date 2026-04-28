import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { Radio, Zap, BarChart3, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import RadioManagerClient from './RadioManagerClient';

export default async function ArtistRadioDashboard() {
  const org = await getSessionArtist({ includeReleases: true });

  return <RadioManagerClient org={org} />;
}

import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
  const artist = await getSessionArtist();
  if (!artist) redirect('/studio/login');

  return <AnalyticsClient artist={artist} />;
}

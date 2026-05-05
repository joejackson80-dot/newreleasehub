export const dynamic = 'force-dynamic';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import PayoutsClient from './PayoutsClient';

export default async function PayoutsPage() {
  const artist = await getSessionArtist();
  if (!artist) redirect('/studio/login');

  return <PayoutsClient artist={artist} />;
}


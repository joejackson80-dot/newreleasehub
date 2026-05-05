export const dynamic = 'force-dynamic';
import { getSessionArtist } from '@/lib/session';
import DJControlRoom from './DJClient';

export const metadata = {
  title: 'Live Control Room | NRH Studio',
  description: 'Institutional-grade live broadcasting and fan interaction console.',
};

export default async function DJPage() {
  const artist = await getSessionArtist();
  return <DJControlRoom artist={artist} />;
}




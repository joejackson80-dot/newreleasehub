export const dynamic = 'force-dynamic';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import ProposalCreatorClient from './ProposalCreatorClient';

export default async function NewProposalPage() {
  const artist = await getSessionArtist();
  if (!artist) redirect('/studio/login');

  return <ProposalCreatorClient />;
}


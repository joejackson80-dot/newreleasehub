import { getProposals } from '@/app/actions/governance';
import { getSessionUser } from '@/lib/session';
import GovernanceClient from './GovernanceClient';
import { redirect } from 'next/navigation';

export default async function GovernancePage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const { proposals = [] } = await getProposals();

  return <GovernanceClient initialProposals={proposals} user={user} />;
}

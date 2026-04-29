import { getProposals } from '@/app/actions/governance';
import { getSessionFan } from '@/lib/session';
import GovernanceClient from './GovernanceClient';
import { redirect } from 'next/navigation';

export default async function GovernancePage() {
  const user = await getSessionFan();
  if (!user) redirect('/fan/login');

  const { proposals = [] } = await getProposals();

  return <GovernanceClient initialProposals={proposals} user={user} />;
}

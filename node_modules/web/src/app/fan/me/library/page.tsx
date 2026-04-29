import { getSessionFan } from '@/lib/session';
import FanLibraryClient from './LibraryClient';

export const metadata = {
  title: 'My Stakes | NRH Network',
  description: 'Manage your Revenue Participation Licenses and track your master stakes yield.',
};

export default async function FanLibraryPage() {
  const user = await getSessionFan();
  return <FanLibraryClient user={user} />;
}



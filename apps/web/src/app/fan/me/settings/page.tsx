import React from 'react';
import { getSessionFan } from '@/lib/session';
import SettingsClient from './SettingsClient';

export const metadata = {
  title: 'Account Settings | New Release Hub',
  description: 'Manage your fan profile, billing, and security settings.',
};

export default async function FanSettingsPage() {
  const user = await getSessionFan();

  return <SettingsClient user={user} />;
}



import React from 'react';
import { getSessionFan } from '@/lib/session';
import DashboardClient from './DashboardClient';
import { createAdminClient } from '@/lib/supabase/admin';
import { getFanFeed, getMessages, getVaultContent } from '@/app/actions/fan';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fan Dashboard | New Release Hub',
  description: 'Manage your library, follow artists, and track your Support.',
};

export default async function FanDashboardPage() {
  const user = await getSessionFan();
  const supabase = createAdminClient();

  // Fetch initial library count (ParticipationLicenses)
  const { count: licenseCount } = await supabase
    .from('participation_licenses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch real Support Stakes (Subscriptions)
  const { data: subscriptions } = await supabase
    .from('supporter_subscriptions')
    .select(`
      *,
      organizations (*),
      tiers (*)
    `)
    .eq('fan_id', user.id)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  // Fetch Feed, Messages, and Vault
  const [feedResult, messagesResult, vaultResult] = await Promise.all([
    getFanFeed(user.id),
    getMessages({ userId: user.id }),
    getVaultContent(user.id)
  ]);

  // Normalize for UI
  const normalizedSubs = (subscriptions || []).map(s => ({
    ...s,
    createdAt: s.created_at,
    Organization: s.organizations,
    Tier: s.tiers
  }));

  return (
    <DashboardClient 
      user={user} 
      initialLibraryCount={licenseCount || 0}
      subscriptions={normalizedSubs}
      initialFeed={feedResult.success ? feedResult.feed : []}
      initialMessages={messagesResult.success ? messagesResult.messages : []}
      initialVault={vaultResult.success ? vaultResult.releases : []}
    />
  );
}

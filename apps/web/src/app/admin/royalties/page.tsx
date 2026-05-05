import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import RoyaltiesDashboardClient from './RoyaltiesDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Royalty Engine | NRH Admin',
  description: 'Manage monthly royalty pools and artist payouts.',
};

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function RoyaltiesAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const adminSupabase = createAdminClient();

  const { data: pools, error } = await adminSupabase
    .from('monthly_pools')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (error) {
    console.error('Failed to fetch royalty pools:', error);
  }

  return (
    <RoyaltiesDashboardClient initialPools={pools || []} />
  );
}

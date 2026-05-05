import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import FraudDashboardClient from './FraudDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fraud Detection | NRH Admin',
  description: 'Monitor and manage streaming fraud across the network.',
};

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function FraudDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }

  const adminSupabase = createAdminClient();

  // 1. Fetch Flagged Incidents
  const { data: flaggedIncidents } = await adminSupabase
    .from('fraud_incidents')
    .select(`
      *,
      Organization:organizations (*)
    `)
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false });

  // 2. Fetch Excluded Streams
  const { data: excludedStreams } = await adminSupabase
    .from('stream_plays')
    .select(`
      *,
      Organization:organizations (*)
    `)
    .eq('is_excluded_from_pool', true)
    .order('started_at', { ascending: false })
    .limit(100);

  // 3. Top Streamers (Aggregation)
  // Since Supabase doesn't have groupBy in JS client, we use an RPC or fetch and aggregate
  // For the dashboard, we'll fetch a larger set and aggregate in-memory or use a view if it existed.
  // We'll simulate with a fetch and manual aggregation for the MVP.
  const { data: streamData } = await adminSupabase
    .from('stream_plays')
    .select('device_id, ip_address, fraud_score')
    .order('started_at', { ascending: false })
    .limit(500);

  const streamerMap = new Map();
  (streamData || []).forEach(s => {
    const key = `${s.device_id}|${s.ip_address}`;
    if (!streamerMap.has(key)) {
      streamerMap.set(key, { deviceId: s.device_id, ipAddress: s.ip_address, _count: { id: 0 }, _sum: { fraudScore: 0 } });
    }
    const entry = streamerMap.get(key);
    entry._count.id++;
    entry._sum.fraudScore += (s.fraud_score || 0);
  });

  const topStreamers = Array.from(streamerMap.values())
    .map(e => ({
      ...e,
      _avg: { fraudScore: e._sum.fraudScore / e._count.id }
    }))
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 50);

  // 4. IP Clusters (24h)
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: clusterData } = await adminSupabase
    .from('stream_plays')
    .select('ip_address, fraud_score')
    .gte('started_at', last24h);

  const ipMap = new Map();
  (clusterData || []).forEach(s => {
    if (!ipMap.has(s.ip_address)) {
      ipMap.set(s.ip_address, { ipAddress: s.ip_address, _count: { id: 0 }, _sum: { fraudScore: 0 } });
    }
    const entry = ipMap.get(s.ip_address);
    entry._count.id++;
    entry._sum.fraudScore += (s.fraud_score || 0);
  });

  const ipClusters = Array.from(ipMap.values())
    .map(e => ({
      ...e,
      _avg: { fraudScore: e._sum.fraudScore / e._count.id }
    }))
    .sort((a, b) => b._count.id - a._count.id)
    .slice(0, 20);

  return (
    <FraudDashboardClient 
      flaggedIncidents={flaggedIncidents || []}
      topStreamers={topStreamers}
      excludedStreams={excludedStreams || []}
      ipClusters={ipClusters}
    />
  );
}

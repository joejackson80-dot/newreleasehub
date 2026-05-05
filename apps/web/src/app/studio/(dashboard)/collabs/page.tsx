import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtist } from '@/lib/session';
import CollabsClient from './CollabsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Collaborations | New Release Hub Studio',
  description: 'Manage your collaboration requests and active deals.',
};

export default async function CollabsPage() {
  const currentOrg = await getSessionArtist();
  const supabase = createAdminClient();

  const { data: incoming } = await supabase
    .from('collab_requests')
    .select(`
      *,
      requester:organizations!requester_id (*)
    `)
    .eq('receiver_id', currentOrg.id)
    .in('status', ['PENDING', 'COUNTERED'])
    .order('created_at', { ascending: false });

  const { data: sent } = await supabase
    .from('collab_requests')
    .select(`
      *,
      receiver:organizations!receiver_id (*)
    `)
    .eq('requester_id', currentOrg.id)
    .order('created_at', { ascending: false });

  const { data: activeDeals } = await supabase
    .from('collab_deals')
    .select(`
      *,
      requester:organizations!requester_id (*),
      receiver:organizations!receiver_id (*),
      releases (*)
    `)
    .or(`requester_id.eq.${currentOrg.id},receiver_id.eq.${currentOrg.id}`)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  // Normalize for UI
  const normalizedIncoming = (incoming || []).map(r => ({
    ...r,
    createdAt: r.created_at,
    requester: r.requester
  }));

  const normalizedSent = (sent || []).map(r => ({
    ...r,
    createdAt: r.created_at,
    receiver: r.receiver
  }));

  const normalizedDeals = (activeDeals || []).map(d => ({
    ...d,
    createdAt: d.created_at,
    requester: d.requester,
    receiver: d.receiver,
    release: d.releases
  }));

  return (
    <CollabsClient 
      currentOrg={currentOrg}
      incoming={normalizedIncoming}
      sent={normalizedSent}
      activeDeals={normalizedDeals}
    />
  );
}

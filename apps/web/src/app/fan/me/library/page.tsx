import { getSessionFan } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import FanLibraryClient from './LibraryClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Stakes | NRH Network',
  description: 'Manage your Revenue Participation Licenses and track your master stakes yield.',
};

interface SupabaseSubscription {
  id: string;
  revenue_share_percent: number;
  organizations?: { name: string };
  supporter_tiers?: { name: string };
}

interface RoyaltyData {
  support_id: string;
  amount_earned: number;
}

export default async function FanLibraryPage() {
  const user = await getSessionFan();
  const supabase = await createClient();
  
  const { data: subscriptions } = await supabase
    .from('supporter_subscriptions')
    .select('*, organizations(name), supporter_tiers(name)')
    .eq('fan_id', user.id)
    .eq('status', 'ACTIVE');

  const { data: royaltiesData } = await supabase
    .from('fan_royalty_shares')
    .select('support_id, amount_earned')
    .eq('fan_id', user.id);

  // Aggregation in JS for simplicity
  const royaltiesMap = new Map<string, number>();
  (royaltiesData as RoyaltyData[] || []).forEach(r => {
    royaltiesMap.set(r.support_id, (royaltiesMap.get(r.support_id) || 0) + r.amount_earned);
  });

  const assets = (subscriptions as SupabaseSubscription[] || []).map(sub => {
    const yieldToDate = royaltiesMap.get(sub.id) || 0;
    const tierName = sub.supporter_tiers?.name || 'Standard License';
    const artistName = sub.organizations?.name || 'Unknown Artist';
    
    return {
      id: sub.id,
      title: tierName + ' License',
      artist: artistName,
      tier: tierName,
      participation: sub.revenue_share_percent,
      yieldToDate: yieldToDate / 100, // cents to dollars
      velocity: 'Active',
      img: '/images/default-avatar.png',
      type: 'Supporter'
    };
  });

  return <FanLibraryClient user={user} assets={assets} />;
}

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import LabelDashboardClient from './LabelDashboardClient';

export const dynamic = 'force-dynamic';

export default async function LabelDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/studio/login');

  const role = user.user_metadata?.role;
  const legacyOrgId = user.user_metadata?.legacy_org_id;

  const adminSupabase = createAdminClient();

  // Fetch the organization based on the legacy ID or email
  let orgData: Record<string, unknown> | null = null;
  if (legacyOrgId) {
    const { data } = await adminSupabase
      .from('organizations')
      .select('*')
      .eq('id', legacyOrgId)
      .maybeSingle();
    orgData = data;
  } else {
    const { data } = await adminSupabase
      .from('organizations')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();
    orgData = data;
  }

  const isLabel = role === 'admin' || role === 'artist'; // For MVP, labels are artists with higher tiers
  const isElite = orgData?.plan_tier === 'ELITE';

  if (!isLabel && !isElite) {
    redirect('/studio');
  }

  // Fetch real roster
  const { data: roster, error: rosterError } = await adminSupabase
    .from('organizations')
    .select(`
      *,
      releases (count),
      supporter_subscriptions (price_cents),
      stream_plays (count)
    `)
    .eq('is_active', true)
    .eq('role', 'artist')
    .limit(10);

  if (rosterError) {
    console.error('Failed to fetch roster:', rosterError);
  }

  let totalStreams = 0;
  let totalEarnings = 0;
  let totalAssets = 0;

  const displayRoster = (roster || []).map(a => {
    const artistStreams = a.stream_plays?.[0]?.count || 0;
    const artistEarningsCents = (a.supporter_subscriptions || []).reduce((sum: number, sub: any) => sum + (sub.price_cents || 0), 0);
    const artistAssets = a.releases?.[0]?.count || 0;
    
    totalStreams += artistStreams;
    totalEarnings += artistEarningsCents;
    totalAssets += artistAssets;

    return {
      id: a.id.substring(0, 8),
      name: a.name,
      status: a.is_active ? 'Active' : 'Inactive',
      streams: artistStreams > 1000000 ? (artistStreams / 1000000).toFixed(1) + 'M' : artistStreams > 1000 ? (artistStreams / 1000).toFixed(1) + 'K' : artistStreams.toString(),
      earnings: '$' + (artistEarningsCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      equity: (a.nrh_equity_score || 0).toFixed(1),
      growth: '+' + (Math.floor(Math.random() * 20) + 1) + '%' // Mock growth for MVP
    };
  });

  const kpis = {
    capacity: displayRoster.length,
    streams: totalStreams > 1000000 ? (totalStreams / 1000000).toFixed(1) + 'M' : totalStreams > 1000 ? (totalStreams / 1000).toFixed(1) + 'K' : totalStreams.toString(),
    valuation: '$' + ((totalEarnings / 100) * 12).toLocaleString(undefined, { maximumFractionDigits: 0 }), // Annualized mock valuation
    assets: totalAssets
  };

  const labelOrg = orgData ? {
    ...orgData,
    planTier: orgData.plan_tier,
    isActive: orgData.is_active,
    nrhEquityScore: orgData.nrh_equity_score
  } : { name: 'Institutional Management' };

  return <LabelDashboardClient labelOrg={labelOrg} roster={displayRoster} kpis={kpis} />;
}

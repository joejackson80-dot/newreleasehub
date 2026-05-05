import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import LabelDashboardClient from './LabelDashboardClient';

export const dynamic = 'force-dynamic';

export default async function LabelDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/studio/login');

  const role = user.user_metadata?.role;
  const legacyOrgId = user.user_metadata?.legacy_org_id;

  // Fetch the organization based on the legacy ID or email
  const org = legacyOrgId 
    ? await prisma.organization.findUnique({ where: { id: legacyOrgId } })
    : await prisma.organization.findFirst({ where: { email: user.email } });

  const isLabel = role === 'admin' || role === 'artist'; // For MVP, labels are artists with higher tiers
  const isElite = org?.planTier === 'ELITE';

  if (!isLabel && !isElite) {
    redirect('/studio');
  }

  // Fetch real roster
  const roster = await prisma.organization.findMany({
    where: {
      isActive: true,
      role: 'artist' // In a real app, this would filter by 'managedBy: org.id'
    },
    include: {
      _count: {
        select: {
          Releases: true,
          SupporterSubscriptions: true,
          StreamPlays: true
        }
      },
      SupporterSubscriptions: {
        select: { priceCents: true }
      }
    },
    take: 10
  });

  let totalStreams = 0;
  let totalEarnings = 0;
  let totalAssets = 0;

  const displayRoster = roster.map(a => {
    const artistStreams = a._count.StreamPlays;
    const artistEarningsCents = a.SupporterSubscriptions.reduce((sum, sub) => sum + sub.priceCents, 0);
    const artistAssets = a._count.Releases;
    
    totalStreams += artistStreams;
    totalEarnings += artistEarningsCents;
    totalAssets += artistAssets;

    return {
      id: a.id.substring(0, 8),
      name: a.name,
      status: a.isActive ? 'Active' : 'Inactive',
      streams: artistStreams > 1000000 ? (artistStreams / 1000000).toFixed(1) + 'M' : artistStreams > 1000 ? (artistStreams / 1000).toFixed(1) + 'K' : artistStreams.toString(),
      earnings: '$' + (artistEarningsCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      equity: a.nrhEquityScore.toFixed(1),
      growth: '+' + (Math.floor(Math.random() * 20) + 1) + '%' // Mock growth for MVP
    };
  });

  const kpis = {
    capacity: displayRoster.length,
    streams: totalStreams > 1000000 ? (totalStreams / 1000000).toFixed(1) + 'M' : totalStreams > 1000 ? (totalStreams / 1000).toFixed(1) + 'K' : totalStreams.toString(),
    valuation: '$' + ((totalEarnings / 100) * 12).toLocaleString(undefined, { maximumFractionDigits: 0 }), // Annualized mock valuation
    assets: totalAssets
  };

  return <LabelDashboardClient labelOrg={org || { name: 'Institutional Management' }} roster={displayRoster} kpis={kpis} />;
}

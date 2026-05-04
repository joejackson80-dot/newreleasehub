import { getSessionFan } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import FanLibraryClient from './LibraryClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Stakes | NRH Network',
  description: 'Manage your Revenue Participation Licenses and track your master stakes yield.',
};

export default async function FanLibraryPage() {
  const user = await getSessionFan();
  
  const subscriptions = await prisma.supporterSubscription.findMany({
    where: { fanId: user.id, status: 'ACTIVE' },
    include: {
      Organization: true,
      Tier: true
    }
  });

  const royalties = await prisma.fanRoyaltyShare.groupBy({
    by: ['supportId'],
    where: { fanId: user.id },
    _sum: { amountEarned: true }
  });

  const assets = subscriptions.map(sub => {
    const yieldToDate = royalties.find(r => r.supportId === sub.id)?._sum.amountEarned || 0;
    return {
      id: sub.id,
      title: sub.Tier.name + ' License',
      artist: sub.Organization.name,
      tier: sub.Tier.name,
      participation: sub.revenueSharePercent,
      yieldToDate: yieldToDate / 100, // cents to dollars
      velocity: 'Active',
      img: '/images/default-avatar.png',
      type: 'Supporter'
    };
  });

  return <FanLibraryClient user={user} assets={assets} />;
}



import { prisma } from '@/lib/prisma';
import BoardClient from './BoardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Opportunity Board | New Release Hub',
  description: 'Discover sync placements, performance grants, paid collaborations, and gig opportunities for independent artists.',
  openGraph: {
    title: 'Opportunity Board | New Release Hub',
    description: 'Industry connections for independent artists. Sync deals, grants, gigs, and collabs — all verified.',
  },
};

export default async function OpportunityBoardPage() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <BoardClient initialOpportunities={opportunities} />;
}



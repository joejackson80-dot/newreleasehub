import { createClient } from '@/lib/supabase/server';
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
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  return <BoardClient initialOpportunities={opportunities || []} />;
}

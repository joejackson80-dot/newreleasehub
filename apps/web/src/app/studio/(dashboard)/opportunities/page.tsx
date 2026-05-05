import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import OpportunitiesManagerClient from './OpportunitiesManagerClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manage Opportunities | Artist Studio',
  description: 'Manage your sync calls, grants, and collaboration requests.',
};

export default async function OpportunitiesPage() {
  const artist = await getSessionArtist();
  if (!artist) redirect('/studio/login');

  const supabase = createAdminClient();

  const { data: opportunities, error } = await supabase
    .from('opportunities')
    .select(`
      *,
      opportunity_applications (
        *,
        organizations!artist_id (name, profile_image_url, slug)
      )
    `)
    .eq('poster_id', artist.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch opportunities:', error);
  }

  // Normalize for UI
  const normalized = (opportunities || []).map(opp => ({
    ...opp,
    createdAt: opp.created_at,
    Applications: (opp.opportunity_applications || []).sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).map((app: any) => ({
      ...app,
      createdAt: app.created_at,
      Artist: {
        name: app.organizations.name,
        profileImageUrl: app.organizations.profile_image_url,
        slug: app.organizations.slug
      }
    }))
  }));

  return (
    <div className="p-8 sm:p-12 space-y-12">
       <OpportunitiesManagerClient initialOpportunities={normalized} />
    </div>
  );
}

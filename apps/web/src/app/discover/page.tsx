import React from 'react';
import { createClient } from '@/lib/supabase/server';
import DiscoverClient from './DiscoverClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Discover New Music | New Release Hub',
  description: 'Find the best independent artists and trending releases across the New Release Hub network.',
};

export default async function DiscoverPage() {
  const supabase = await createClient();

  const [
    { data: featuredArtists, error: aError },
    { data: latestReleases, error: rError }
  ] = await Promise.all([
    supabase
      .from('organizations')
      .select('*, releases:releases(*)')
      .order('supporter_count', { ascending: false })
      .limit(12),
    supabase
      .from('releases')
      .select('*, organizations(*)')
      .eq('is_scheduled', false)
      .order('created_at', { ascending: false })
      .limit(12)
  ]);

  if (aError || rError) {
    console.error('Error fetching discovery data:', { aError, rError });
  }

  // Extract unique genres from all featured artists for the genre filter bar
  const allGenres = (featuredArtists || []).flatMap((a: any) => a.genres || []);
  const uniqueGenres = ['All', ...Array.from(new Set(allGenres)).sort()];

  // Normalize data for client component
  const normalizedArtists = (featuredArtists || []).map((a: any) => ({
    ...a,
    profileImageUrl: a.profile_image_url,
    supporterCount: a.supporter_count,
    Releases: (a.releases || []).slice(0, 1).map((r: any) => ({
      ...r,
      createdAt: r.created_at
    }))
  }));

  const normalizedReleases = (latestReleases || []).map((r: any) => ({
    ...r,
    coverArtUrl: r.cover_art_url,
    audioUrl: r.audio_url,
    createdAt: r.created_at,
    isScheduled: r.is_scheduled,
    Organization: r.organizations
  }));

  return (
    <DiscoverClient 
      featuredArtists={normalizedArtists}
      latestReleases={normalizedReleases}
      genres={uniqueGenres}
    />
  );
}

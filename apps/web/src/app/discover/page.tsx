import React from 'react';
import { prisma } from '@/lib/prisma';
import DiscoverClient from './DiscoverClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Discover New Music | New Release Hub',
  description: 'Find the best independent artists and trending releases across the New Release Hub network.',
};

export default async function DiscoverPage() {
  const featuredArtists = await prisma.organization.findMany({
    take: 12,
    orderBy: { supporterCount: 'desc' },
    include: { Releases: { take: 1, orderBy: { createdAt: 'desc' } } }
  });

  const latestReleases = await prisma.release.findMany({
    take: 12,
    where: { isScheduled: false },
    orderBy: { createdAt: 'desc' },
    include: { Organization: true }
  });

  // Extract unique genres from all featured artists for the genre filter bar
  const allGenres = featuredArtists.flatMap((a: any) => a.genres || []);
  const uniqueGenres = ['All', ...Array.from(new Set(allGenres)).sort()];

  return (
    <DiscoverClient 
      featuredArtists={featuredArtists}
      latestReleases={latestReleases}
      genres={uniqueGenres}
    />
  );
}




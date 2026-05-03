import React from 'react';
import { prisma } from '@/lib/prisma';
import ReleaseDetailClient from './ReleaseDetailClient';

export default async function ReleaseDetailPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const resolvedParams = await params;
  const { slug, id } = resolvedParams;
  const artistName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const release = await prisma.release.findUnique({
    where: { id }
  });

  if (!release) {
    return <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">Release not found</div>;
  }

  // Fetch tracklist if any (mock for now since schema might not have it)
  // Or just pass the release to the client component.
  const releaseData = {
    ...release,
    artistName,
    slug,
  };

  return <ReleaseDetailClient release={releaseData} />;
}



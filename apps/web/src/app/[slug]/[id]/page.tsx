import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import ReleaseDetailClient from './ReleaseDetailClient';

export default async function ReleaseDetailPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const resolvedParams = await params;
  const { slug, id } = resolvedParams;
  const artistName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const supabase = createAdminClient();

  const { data: release, error } = await supabase
    .from('releases')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !release) {
    return <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">Release not found</div>;
  }

  // Normalize for UI
  const releaseData = {
    ...release,
    title: release.title,
    type: release.type,
    coverArtUrl: release.cover_art_url,
    releaseDate: release.release_date,
    artistName,
    slug,
  };

  return <ReleaseDetailClient release={releaseData} />;
}

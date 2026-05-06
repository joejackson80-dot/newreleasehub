export const dynamic = 'force-dynamic';
import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtist } from '@/lib/session';
import NewCollabClient from './NewCollabClient';

export const metadata = {
  title: 'New Collaboration Request | New Release Hub Studio',
  description: 'Propose a new collaboration with another artist on the NRH network.',
};

export default async function NewCollabPage({ searchParams }: { searchParams: Promise<{ artist?: string }> }) {
  const { artist: artistSlug } = await searchParams;

  const supabase = createAdminClient();

  let targetArtist: { id: string; name: string; slug: string; profile_image_url: string | null; profileImageUrl: string | null } | null = null;
  if (artistSlug) {
    const { data } = await supabase
      .from('organizations')
      .select('id, name, slug, profile_image_url')
      .eq('slug', artistSlug)
      .maybeSingle();
    
    if (data) {
      targetArtist = {
        ...data,
        profileImageUrl: data.profile_image_url
      };
    }
  }

  const currentOrg = await getSessionArtist();

  return (
    <NewCollabClient 
      targetArtist={targetArtist}
      currentOrg={currentOrg}
    />
  );
}

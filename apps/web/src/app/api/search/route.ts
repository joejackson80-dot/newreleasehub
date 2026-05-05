export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeResponse } from '@/lib/private/sanitize';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const supabase = await createClient();
    const results: { id: string | number; type: string; [key: string]: unknown }[] = [];

    // Search Artists (Organizations)
    if (!type || type === 'All' || type === 'Artists') {
      const { data: artists } = await supabase
        .from('organizations')
        .select('*')
        .or(`name.ilike.%${query}%,genres.cs.{"${query}"},city.ilike.%${query}%`)
        .limit(10);

      (artists || []).forEach((artist: { id: string; name: string; genres?: string[]; profile_image_url?: string; artist_tier?: string; slug: string }) => {
        results.push({
          id: artist.id,
          type: 'artist',
          name: artist.name,
          category: (artist.genres || []).join(' / ') || 'Independent',
          img: artist.profile_image_url || '/images/default-avatar.png',
          badge: (artist.artist_tier || 'standard').toUpperCase().replace('_', ' '),
          slug: artist.slug
        });
      });
    }

    // Search Releases
    if (!type || type === 'All' || type === 'Releases') {
      const { data: releases } = await supabase
        .from('releases')
        .select('*, organizations(*)')
        .ilike('title', `%${query}%`)
        .limit(10);

      (releases || []).forEach((release: { id: string; title: string; organizations?: { name: string; slug: string }; type?: string; release_date: string; cover_art_url?: string; is_scheduled?: boolean }) => {
        results.push({
          id: release.id,
          type: 'release',
          title: release.title,
          artist: release.organizations?.name || 'Unknown',
          category: `${(release.type || 'Single').toUpperCase()} • ${new Date(release.release_date).getFullYear()}`,
          img: release.cover_art_url || '/images/default-cover.png',
          status: release.is_scheduled ? 'SCHEDULED' : 'LIVE',
          artistSlug: release.organizations?.slug
        });
      });
    }

    // Search Hubs
    if (!type || type === 'All' || type === 'Hubs') {
      const { data: hubs } = await supabase
        .from('organizations')
        .select('*')
        .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
        .limit(5);

      (hubs || []).forEach((hub: { id: string; name: string; slug: string; profile_image_url?: string }) => {
        results.push({
          id: `hub-${hub.id}`,
          type: 'hub',
          name: hub.name,
          slug: hub.slug,
          img: hub.profile_image_url || '/images/default-avatar.png',
          isLive: true,
          scene: 'Recording Studio A'
        });
      });
    }

    // Search Opportunities
    if (!type || type === 'All' || type === 'Opportunities') {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      (opportunities || []).forEach((opp: { id: string; title: string; poster_name?: string; type?: string; reward_cents?: number; deadline?: string }) => {
        results.push({
          id: opp.id,
          type: 'opportunity',
          title: opp.title,
          poster: opp.poster_name || 'Institutional Partner',
          category: `${(opp.type || 'Gig').toUpperCase()} • $${(opp.reward_cents || 0) / 100}`,
          deadline: opp.deadline ? `${Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left` : 'Open',
        });
      });
    }

    return NextResponse.json(sanitizeResponse(results));
  } catch (error: unknown) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

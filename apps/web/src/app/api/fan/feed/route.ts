export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const fanId = await getSessionFanId();
    if (!fanId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const supabase = createAdminClient();

    // 1. Fetch followed artists
    const { data: follows } = await supabase
      .from('followers')
      .select('organization_id')
      .eq('user_id', fanId);

    const orgIds = (follows || []).map(f => f.organization_id);

    if (orgIds.length === 0) {
      return NextResponse.json({ success: true, feed: [] });
    }

    // 2. Fetch releases and posts from followed artists
    const { data: releases, error: relError } = await supabase
      .from('releases')
      .select(`
        *,
        organizations (name, slug, profile_image_url, is_verified),
        tracks (audio_url)
      `)
      .in('organization_id', orgIds)
      .eq('is_scheduled', false)
      .order('release_date', { ascending: false })
      .limit(10);

    if (relError) throw relError;

    // Transform into feed items
    const feedItems = (releases || []).map(r => ({
      id: r.id,
      type: 'release',
      title: r.title,
      content: `New ${r.type} just dropped — "${r.title}" is out now.`,
      coverArtUrl: r.cover_art_url,
      audioUrl: (r.tracks || []).find((t: any) => t.audio_url)?.audio_url || '',
      createdAt: r.release_date,
      Organization: r.organizations,
      isSupporterOnly: false,
      reactions: { fire: 0, heart: 0, crown: 0, bolt: 0 },
      comments: 0
    }));

    return NextResponse.json({ success: true, feed: feedItems });
  } catch (error: unknown) {
    console.error('Fan Feed API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

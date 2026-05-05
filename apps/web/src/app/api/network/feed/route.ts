export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const supabase = await createClient();

    // Fetch Milestones, Releases (Tracks), and Collabs in parallel
    const [
      { data: milestonesData },
      { data: releasesData },
      { data: collabsData }
    ] = await Promise.all([
      supabase
        .from('artist_milestones')
        .select('*, organizations!artist_id(name, slug, profile_image_url)')
        .order('achieved_at', { ascending: false })
        .limit(limit),
      supabase
        .from('tracks')
        .select('*, organizations(*)')
        .eq('is_live', true)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('collab_requests')
        .select('*, requester:organizations!requester_id(name, profile_image_url), receiver:organizations!receiver_id(name, profile_image_url)')
        .eq('status', 'ACCEPTED')
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);

    // Unified Feed Items
    const feedItems: any[] = [
      ...(milestonesData || []).map(m => ({
        id: `milestone-${m.id}`,
        type: 'MILESTONE',
        title: `${m.organizations?.name} achieved ${m.type.replace('_', ' ')}`,
        description: `New institutional milestone verified: ${m.type.replace('_', ' ')} protocol.`,
        timestamp: m.achieved_at,
        artist: {
          name: m.organizations?.name,
          slug: m.organizations?.slug,
          profileImageUrl: m.organizations?.profile_image_url
        },
        metadata: { type: m.type, icon: '🏆' }
      })),
      ...(releasesData || []).map(r => ({
        id: `release-${r.id}`,
        type: 'RELEASE',
        title: `New Release: ${r.title}`,
        description: `${r.organizations?.name} just dropped a new track.`,
        timestamp: r.created_at,
        artist: {
          name: r.organizations?.name,
          slug: r.organizations?.slug,
          profileImageUrl: r.organizations?.profile_image_url
        },
        metadata: { assetId: r.id, icon: '🎵' }
      })),
      ...(collabsData || []).map(c => ({
        id: `collab-${c.id}`,
        type: 'COLLAB',
        title: `${c.requester?.name} x ${c.receiver?.name}`,
        description: `New collaboration protocol established: ${c.project_title}`,
        timestamp: c.created_at,
        artist: {
          name: c.requester?.name,
          profileImageUrl: c.requester?.profile_image_url
        },
        metadata: { icon: '🤝' }
      }))
    ];

    // Sort by timestamp
    feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ 
      success: true, 
      feed: feedItems.slice(0, limit) 
    });
  } catch (error: unknown) {
    console.error('Network Feed API error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

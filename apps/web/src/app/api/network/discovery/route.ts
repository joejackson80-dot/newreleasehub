export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch top 5 trending artists (by supporter count)
    const { data: topArtists } = await supabase
      .from('organizations')
      .select('id, name, slug, profile_image_url, supporter_count')
      .order('supporter_count', { ascending: false })
      .limit(5);

    // Fetch latest 4 opportunities
    const { data: latestOpps } = await supabase
      .from('opportunities')
      .select('*')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })
      .limit(4);

    const items = [
      ...(topArtists || []).map(a => ({
        id: a.id,
        type: 'artist',
        name: a.name,
        slug: a.slug,
        profileImageUrl: a.profile_image_url || '/images/default-avatar.png',
        growth: Math.floor(Math.random() * 15) + 5 // Simulated growth metric
      })),
      ...(latestOpps || []).map(o => ({
        id: o.id,
        type: 'opportunity',
        title: o.title,
        description: o.description,
        category: o.type,
        reward: o.budget || 'PROTOCOL REWARD',
        deadline: o.deadline ? new Date(o.deadline).toLocaleDateString() : 'Rolling'
      }))
    ];

    return NextResponse.json({ success: true, items });
  } catch (error: unknown) {
    console.error('Network Discovery API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { organizationId, youtubeStreamKey, twitterStreamKey, twitchStreamKey } = await req.json();

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: org, error } = await supabase
      .from('organizations')
      .update({
        youtube_stream_key: youtubeStreamKey,
        twitter_stream_key: twitterStreamKey,
        twitch_stream_key: twitchStreamKey
      })
      .eq('id', organizationId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(org);
  } catch (error: unknown) {
    console.error('Broadcast API POST error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

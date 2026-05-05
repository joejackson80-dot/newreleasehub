export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSessionArtist } from '@/lib/session';

export async function GET() {
  try {
    const artist = await getSessionArtist();
    const supabase = await createClient();
    
    const { data: participation, error } = await supabase
      .from('fan_royalty_shares')
      .select(`
        *,
        users (
          display_name,
          avatar_url,
          fan_level
        )
      `)
      .eq('artist_id', artist.id)
      .order('amount_earned', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, participation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSessionArtist } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const artist = await getSessionArtist();
    if (!artist) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { receiverUserId, text } = await req.json();

    if (!receiverUserId || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: message, error } = await supabase
      .from('direct_messages')
      .insert({
        text,
        sender_org_id: artist.id,
        receiver_user_id: receiverUserId,
      })
      .select(`
        *,
        senderOrg:organizations!sender_org_id (name, profile_image_url),
        receiverUser:users!receiver_user_id (display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message });
  } catch (error: unknown) {
    console.error('Send Message API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

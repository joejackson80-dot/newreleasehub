export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { organizationId, user, text, platform, platformIconUrl } = await req.json();

    if (!organizationId || !user || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        organization_id: organizationId,
        user,
        text,
        platform: platform || 'EXTERNAL',
        platform_icon_url: platformIconUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(message);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

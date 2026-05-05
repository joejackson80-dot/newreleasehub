export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    if (!orgId) throw new Error("orgId is required");

    const supabase = await createClient();
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(messages.reverse());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { organizationId, user, text, platform, badge } = await req.json();
    
    if (!organizationId || !user || !text) {
      throw new Error("Missing required fields");
    }

    const supabase = await createClient();
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        organization_id: organizationId,
        user,
        text,
        platform: platform || "NRH",
        badge: badge || null
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

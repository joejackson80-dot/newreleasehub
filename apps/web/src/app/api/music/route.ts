export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { organizationId, title, audioUrl, imageUrl } = await req.json();

    if (!organizationId || !title || !audioUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: asset, error } = await supabase
      .from('tracks')
      .insert({
        organization_id: organizationId,
        title,
        audio_url: audioUrl,
        image_url: imageUrl,
        allocated_license_bps: 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(asset);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');
    if (!orgId) throw new Error("orgId is required");

    const supabase = await createClient();
    const { data: assets, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('organization_id', orgId)
      .order('title', { ascending: true });

    if (error) throw error;

    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

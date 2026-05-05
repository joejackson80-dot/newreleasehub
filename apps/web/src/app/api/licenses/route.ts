export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');

    if (!orgId) {
      return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: licenses, error } = await supabase
      .from('participation_licenses')
      .select(`
        *,
        tracks (*)
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Normalize for response
    const normalized = (licenses || []).map(lic => ({
      ...lic,
      MusicAsset: lic.tracks
    }));

    return NextResponse.json(normalized);
  } catch (error: unknown) {
    console.error('Licenses API error:', error);
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ tracks: [] });
  }

  try {
    const supabase = createAdminClient();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('crate')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user || !user.crate || user.crate.length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const { data: tracks, error: trackError } = await supabase
      .from('tracks')
      .select(`
        *,
        organizations (id, name, slug)
      `)
      .in('id', user.crate);

    if (trackError) throw trackError;

    // Normalize for response
    const normalized = (tracks || []).map(t => ({
      ...t,
      Organization: t.organizations
    }));

    return NextResponse.json({ tracks: normalized });
  } catch (error: unknown) {
    console.error('Error fetching library tracks:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { safeError } from '@/lib/private/sanitize';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organizationId, title, externalVodId, vodPlatform, finalFireCount, totalFundingCents } = await req.json();

    if (!organizationId || !title) {
      return NextResponse.json({ error: 'organizationId and title are required' }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: org } = await admin
      .from('organizations')
      .select('id')
      .eq('id', organizationId)
      .maybeSingle();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const { data: archive, error } = await admin
      .from('session_archives')
      .insert({
        organization_id: organizationId,
        title,
        external_vod_id: externalVodId || null,
        vod_platform: vodPlatform || null,
        final_fire_count: finalFireCount ?? 0,
        total_funding_cents: totalFundingCents ?? 0,
        archived_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[Archive Error]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, archive });
  } catch (error: unknown) {
    console.error('[Archive Route Error]', error);
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json({ error: 'organizationId is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: archives, error } = await admin
      .from('session_archives')
      .select('*')
      .eq('organization_id', organizationId)
      .order('archived_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ archives: archives || [] });
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

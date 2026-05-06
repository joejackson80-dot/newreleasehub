export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeError } from '@/lib/private/sanitize';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { officialBio, pressKitUrl, featuredTracks } = await req.json();

    const pressKitJson = JSON.stringify({
      url: pressKitUrl || null,
      featuredTracks: featuredTracks || [],
    });

    const { data: org, error } = await supabase
      .from('organizations')
      .update({
        ...(officialBio !== undefined && { official_bio: officialBio }),
        press_kit_json: pressKitJson,
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${user.user_metadata?.legacy_org_id || 'null'},email.eq.${user.email || 'null'}`)
      .select()
      .single();

    if (error) {
      console.error('[EPK Update Error]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, org });
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: org, error } = await supabase
      .from('organizations')
      .select('official_bio, press_kit_json, name, slug, profile_image_url, header_image_url')
      .or(`id.eq.${user.user_metadata?.legacy_org_id || 'null'},email.eq.${user.email || 'null'}`)
      .maybeSingle();

    if (error) throw error;
    if (!org) return NextResponse.json({ error: 'Artist not found' }, { status: 404 });

    return NextResponse.json({
      officialBio: org.official_bio || '',
      pressKitJson: org.press_kit_json || null,
      name: org.name,
      slug: org.slug,
      profileImageUrl: org.profile_image_url,
      headerImageUrl: org.header_image_url,
    });
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

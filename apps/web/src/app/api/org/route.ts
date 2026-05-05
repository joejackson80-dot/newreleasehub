export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeResponse, safeError } from '@/lib/private/sanitize';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) throw new Error("slug is required");

    const supabase = await createClient();
    const { data: org, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Normalize for UI
    const normalized = {
      ...org,
      profileImageUrl: org.profile_image_url,
      headerImageUrl: org.header_image_url,
      isVerified: org.is_verified,
      supporterCount: org.supporter_count,
      totalStreams: org.total_streams
    };

    return NextResponse.json(sanitizeResponse(normalized));
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { slug, name, bio, profileImageUrl } = await req.json();
    if (!slug) throw new Error("slug is required");

    const supabase = await createClient();
    const { data: org, error } = await supabase
      .from('organizations')
      .update({
        ...(name && { name }),
        ...(bio && { bio }),
        ...(profileImageUrl && { profile_image_url: profileImageUrl })
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;

    // Normalize for UI
    const normalized = {
      ...org,
      profileImageUrl: org.profile_image_url
    };

    return NextResponse.json(sanitizeResponse(normalized));
  } catch (error: unknown) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

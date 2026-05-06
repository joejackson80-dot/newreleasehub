export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { artistName, email, password } = body;

    if (!artistName || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Create Auth User in Supabase with Artist role
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: artistName,
        role: 'artist',
        is_artist: true,
        onboarding_step: 1
      }
    });

    if (authError) {
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
    }

    // 2. Create Public User Profile
    const username = artistName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        username,
        display_name: artistName,
        fan_level: 1,
        fan_xp: 0
      });

    if (userError) {
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw userError;
    }

    // 3. Create Artist Organization (Hub)
    const slug = artistName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const { error: orgError } = await supabase
      .from('organizations')
      .insert({
        id: authUser.user.id, // Using same UUID for simplicity in 1:1 artists
        name: artistName,
        email: email,
        slug: slug || `artist-${authUser.user.id.slice(0, 8)}`,
        plan_tier: 'standard',
        is_verified: false,
        total_streams: 0,
        supporter_count: 0,
        balance_cents: 0
      });

    if (orgError) {
      // Rollback both if org creation fails
      await supabase.from('users').delete().eq('id', authUser.user.id);
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw orgError;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Artist Registration Error]', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

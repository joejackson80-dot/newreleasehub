export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Create Auth User in Supabase
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        role: 'fan',
        name: username
      }
    });

    if (authError) {
      return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
    }

    // 2. Create Public Profile in public.users
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        username,
        email,
        display_name: username,
        fan_level: 1,
        fan_xp: 0
      });

    if (dbError) {
      // Rollback Auth User if DB creation fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw dbError;
    }

    // 3. Send welcome email (async)
    sendWelcomeEmail({ to: email, name: username }).catch(err => console.error('Failed to send welcome email:', err));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Fan Registration Error]', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

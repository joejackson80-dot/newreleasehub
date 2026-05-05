import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Lazy Sync: Ensure the user exists in public.users
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()

      if (!profile) {
        // Create basic profile for OAuth users
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || `user_${data.user.id.slice(0, 8)}`,
            display_name: data.user.user_metadata?.name || data.user.email,
            fan_level: 1,
            fan_xp: 0
          })
      }

      const role = data.user.user_metadata?.role
      if (role === 'artist') return NextResponse.redirect(`${origin}/studio`)
      if (role === 'admin') return NextResponse.redirect(`${origin}/admin`)
      return NextResponse.redirect(`${origin}/fan/me`)
    }
  }

  // Fallback if no code or error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}

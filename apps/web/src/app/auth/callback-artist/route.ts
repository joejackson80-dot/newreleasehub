import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/studio/register?error=oauth_failed`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/studio/register?error=oauth_failed`)
  }

  const user = data.user
  const admin = createAdminClient()

  // Ensure public user profile exists
  const { data: profile } = await admin
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    await admin.from('users').insert({
      id: user.id,
      email: user.email,
      username: `user_${user.id.slice(0, 8)}`,
      display_name: user.user_metadata?.name || user.email,
      fan_level: 1,
      fan_xp: 0,
    })
  }

  // Ensure artist organization exists
  const { data: org } = await admin
    .from('organizations')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!org) {
    const artistName = user.user_metadata?.name || user.email?.split('@')[0] || 'Artist'
    const slug = artistName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

    await admin.from('organizations').insert({
      id: user.id,
      name: artistName,
      email: user.email,
      slug: slug || `artist-${user.id.slice(0, 8)}`,
      plan_tier: 'standard',
      is_verified: false,
      total_streams: 0,
      supporter_count: 0,
      balance_cents: 0,
    })
  }

  // Tag the user as artist in their auth metadata
  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      role: 'artist',
      is_artist: true,
    },
  })

  return NextResponse.redirect(`${origin}/studio`)
}

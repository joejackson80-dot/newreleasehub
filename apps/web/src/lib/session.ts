import { createClient } from '@/lib/supabase/server';

export async function getSessionArtist(options: { includeReleases?: boolean; includeSupporters?: boolean } = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const legacyOrgId = user.user_metadata?.legacy_org_id;

  // Build the select string based on options
  let selectStr = '*';
  if (options.includeReleases) selectStr += ', releases(*)';
  if (options.includeSupporters) selectStr += ', supporter_subscriptions(*)';

  const { data: org, error } = await supabase
    .from('organizations')
    .select(selectStr)
    .or(`id.eq.${legacyOrgId || 'null'},email.eq.${user.email || 'null'}`)
    .maybeSingle();

  if (error) {
    console.error('Error fetching session artist:', error);
    return null;
  }

  if (!org) return null;

  interface SupabaseRelease {
    id: string;
    audio_url?: string;
    cover_art_url?: string;
    is_scheduled?: boolean;
    release_date?: string;
    [key: string]: unknown;
  }

  interface SupabaseSubscription {
    id: string;
    price_cents: number;
    stripe_subscription_id?: string;
    started_at?: string;
    ends_at?: string;
    [key: string]: unknown;
  }

  // Normalize data for UI compatibility with Prisma structure
  return {
    ...org,
    Releases: (org.releases || []).map((r: SupabaseRelease) => ({
      ...r,
      audioUrl: r.audio_url,
      coverArtUrl: r.cover_art_url,
      isScheduled: r.is_scheduled,
      releaseDate: r.release_date
    })),
    SupporterSubscriptions: (org.supporter_subscriptions || []).map((s: SupabaseSubscription) => ({
      ...s,
      priceCents: s.price_cents,
      stripeSubscriptionId: s.stripe_subscription_id,
      startedAt: s.started_at,
      endsAt: s.ends_at
    })),
    planTier: org.plan_tier || 'standard',
    monthlyListeners: org.monthly_listeners || 0,
    supporterCount: org.supporter_count || 0,
    totalStreams: org.total_streams || 0,
    balanceCents: org.balance_cents || 0,
    profileImageUrl: org.profile_image_url,
    headerImageUrl: org.header_image_url,
    isVerified: org.is_verified,
    socialLinksJson: org.social_links_json
  };
}

export async function getSessionFan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: fan, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email!)
    .maybeSingle();

  if (error) {
    console.error('Error fetching session fan:', error);
    return null;
  }

  if (!fan) return null;

  // Normalize user data
  return {
    ...fan,
    displayName: fan.display_name,
    avatarUrl: fan.avatar_url,
    fanLevel: fan.fan_level,
    fanXP: fan.fan_xp,
    passwordHash: fan.password_hash
  };
}

export async function getSessionArtistId() {
  const org = await getSessionArtist();
  return org?.id || null;
}

export async function getSessionFanId() {
  const fan = await getSessionFan();
  return fan?.id || null;
}

export async function getSessionUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: dbUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email!)
    .maybeSingle();

  if (error) {
    console.error('Error fetching session user:', error);
    return null;
  }

  if (!dbUser) return null;

  return {
    ...dbUser,
    displayName: dbUser.display_name,
    avatarUrl: dbUser.avatar_url,
    fanLevel: dbUser.fan_level,
    fanXP: dbUser.fan_xp
  };
}

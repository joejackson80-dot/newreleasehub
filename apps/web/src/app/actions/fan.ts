'use server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkAndAwardFanBadges } from '@/lib/fan/badges';
import { createSupporterSession } from '@/lib/stripe';
import { revalidatePath } from 'next/cache';

export async function processFanCheckout(artistId: string, tierId: string) {
  try {
    const supabase = await createClient();
    
    // Attempt to get current user, or use mock if needed (demo mode)
    let { data: { user: authUser } } = await supabase.auth.getUser();
    
    let dbUser;
    if (!authUser) {
      // Mock fan for demo
      const { data: mockUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'fan@example.com')
        .maybeSingle();
      
      if (!mockUser) {
        const { data: newUser, error: createError } = await createAdminClient()
          .from('users')
          .insert({
            email: 'fan@example.com',
            display_name: 'SuperFan',
            username: 'superfan01',
          })
          .select()
          .single();
        if (createError) throw createError;
        dbUser = newUser;
      } else {
        dbUser = mockUser;
      }
    } else {
      const { data: actualUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email!)
        .single();
      dbUser = actualUser;
    }

    if (!dbUser) throw new Error("User not found");

    const { data: tier, error: tierError } = await supabase
      .from('supporter_tiers')
      .select('*, organizations(*)')
      .eq('id', tierId)
      .single();

    if (tierError || !tier || !tier.organizations) throw new Error("Tier not found");

    const session = await createSupporterSession(
      dbUser.id,
      dbUser.email,
      artistId,
      tierId,
      tier.price_cents,
      tier.organizations.name,
      tier.name
    );

    return { success: true, checkoutUrl: session.url };
  } catch (error: unknown) {
    console.error('Fan checkout error:', error);
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return { success: false, error: message };
  }
}

export async function getFanFeed(userId: string) {
  try {
    const supabase = await createClient();
    
    // 1. Get the list of artists the user follows
    const { data: follows } = await supabase
      .from('followers')
      .select('organization_id')
      .eq('user_id', userId);
    
    const followingIds = (follows || []).map(f => f.organization_id);
    
    // 2. Get releases and posts from followed artists
    const [releasesResult, postsResult] = await Promise.all([
      supabase
        .from('releases')
        .select('*, organizations(*)')
        .in('organization_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('posts')
        .select('*, organizations(*)')
        .in('organization_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);
    
    if (releasesResult.error) throw releasesResult.error;
    if (postsResult.error) throw postsResult.error;
    
    // Merge and sort
    const feed = [
      ...(releasesResult.data || []).map(r => ({ ...r, type: 'release', Organization: r.organizations, createdAt: new Date(r.created_at) })),
      ...(postsResult.data || []).map(p => ({ ...p, type: 'post', Organization: p.organizations, createdAt: new Date(p.created_at) }))
    ].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return { success: true, feed };
  } catch (error: unknown) {
    console.error('Fetch feed error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch feed';
    return { success: false, error: message };
  }
}

export async function reactToRadio(stationSlug: string, reactionType: string) {
  try {
    const supabase = await createClient();
    
    const { data: station } = await supabase
      .from('stations')
      .select('now_playing_id')
      .eq('slug', stationSlug)
      .single();
    
    if (!station || !station.now_playing_id) return { success: false, error: "No track currently playing" };
    
    let { data: { user: authUser } } = await supabase.auth.getUser();
    let dbUser;
    
    if (!authUser) {
      const { data: mockUser } = await supabase.from('users').select('id').eq('email', 'fan@example.com').maybeSingle();
      dbUser = mockUser;
    } else {
      const { data: actualUser } = await supabase.from('users').select('id').eq('email', authUser.email!).maybeSingle();
      dbUser = actualUser;
    }

    if (!dbUser) return { success: false, error: "Authentication required" };

    const { error } = await supabase
      .from('reactions')
      .insert({
        user_id: dbUser.id,
        release_id: station.now_playing_id,
        type: reactionType
      });

    if (error && error.code !== '23505') throw error; // Ignore unique constraint violations

    return { success: true };
  } catch (error: unknown) {
    console.error('Radio reaction error:', error);
    const message = error instanceof Error ? error.message : 'Reaction failed';
    return { success: false, error: message };
  }
}

export async function sendDM(data: {
  text: string,
  senderUserId?: string,
  senderOrgId?: string,
  receiverUserId?: string,
  receiverOrgId?: string
}) {
  try {
    const supabase = await createClient();
    const { data: message, error } = await supabase
      .from('direct_messages')
      .insert({
        text: data.text,
        sender_user_id: data.senderUserId,
        sender_org_id: data.senderOrgId,
        receiver_user_id: data.receiverUserId,
        receiver_org_id: data.receiverOrgId
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, message };
  } catch (error: unknown) {
    console.error('Send DM error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return { success: false, error: message };
  }
}

export async function getMessages(params: {
  userId?: string,
  orgId?: string
}) {
  try {
    const supabase = await createClient();
    
    let query = supabase.from('direct_messages').select('*, sender_user:users!sender_user_id(*), sender_org:organizations!sender_org_id(*), receiver_user:users!receiver_user_id(*), receiver_org:organizations!receiver_org_id(*)');
    
    const orConditions: string[] = [];
    if (params.userId) {
      orConditions.push(`sender_user_id.eq.${params.userId}`, `receiver_user_id.eq.${params.userId}`);
    }
    if (params.orgId) {
      orConditions.push(`sender_org_id.eq.${params.orgId}`, `receiver_org_id.eq.${params.orgId}`);
    }
    
    if (orConditions.length > 0) {
      query = query.or(orConditions.join(','));
    }

    const { data: messages, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Normalize to match previous Prisma structure if needed
    const normalizedMessages = (messages || []).map(m => ({
      ...m,
      senderUser: m.sender_user,
      senderOrg: m.sender_org,
      receiverUser: m.receiver_user,
      receiverOrg: m.receiver_org,
      createdAt: new Date(m.created_at)
    }));

    return { success: true, messages: normalizedMessages };
  } catch (error: unknown) {
    console.error('Get messages error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch messages';
    return { success: false, error: message };
  }
}

export async function getVaultContent(userId: string) {
  try {
    const supabase = await createClient();
    
    // 1. Get the list of artists the user supports
    const { data: subscriptions } = await supabase
      .from('supporter_subscriptions')
      .select('artist_id')
      .eq('fan_id', userId)
      .eq('status', 'ACTIVE');
    
    const supporterOfIds = (subscriptions || []).map(s => s.artist_id);
    
    // 2. Get all is_supporter_only releases from these artists
    const { data: exclusiveReleases, error } = await supabase
      .from('releases')
      .select('*, organizations(*)')
      .in('organization_id', supporterOfIds)
      .eq('is_supporter_only', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    const normalizedReleases = (exclusiveReleases || []).map(r => ({
      ...r,
      Organization: r.organizations,
      createdAt: new Date(r.created_at)
    }));
    
    return { success: true, releases: normalizedReleases };
  } catch (error: unknown) {
    console.error('Fetch vault error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch vault';
    return { success: false, error: message };
  }
}

export async function logListeningSession(userId: string, trackId: string) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // 1. Record the stream play
    const { data: track } = await supabase
      .from('tracks')
      .select('organization_id')
      .eq('id', trackId)
      .single();

    await adminClient
      .from('stream_plays')
      .insert({
        listener_id: userId,
        track_id: trackId,
        artist_id: track?.organization_id || '',
        started_at: new Date().toISOString(),
        counted_as_stream: true
      });

    // 2. Update listening stats and streak
    const { data: stats } = await supabase
      .from('fan_listening_stats')
      .select('*')
      .eq('fan_id', userId)
      .maybeSingle();
      
    let xpToAdd = 10; // Base XP for a stream

    if (stats) {
      const now = new Date();
      const lastPlayed = new Date(stats.last_listening_date || 0);
      let newStreak = stats.listening_streak || 0;
      
      const diffDays = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
        xpToAdd += 50; // Streak bonus
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      await adminClient
        .from('fan_listening_stats')
        .update({
          total_streams_all_time: (stats.total_streams_all_time || 0) + 1,
          total_listening_hrs: (stats.total_listening_hrs || 0) + 0.05,
          listening_streak: newStreak,
          last_listening_date: now.toISOString()
        })
        .eq('fan_id', userId);
    } else {
      await adminClient
        .from('fan_listening_stats')
        .insert({
          fan_id: userId,
          total_streams_all_time: 1,
          total_listening_hrs: 0.05,
          listening_streak: 1,
          last_listening_date: new Date().toISOString()
        });
    }

    // 3. Update User XP and Level
    const { data: user } = await supabase
      .from('users')
      .select('fan_xp, fan_level')
      .eq('id', userId)
      .single();
      
    if (user) {
      let newXP = (user.fan_xp || 0) + xpToAdd;
      let newLevel = user.fan_level || 1;
      
      const xpNeeded = newLevel * 500;
      if (newXP >= xpNeeded) {
        newLevel += 1;
        newXP -= xpNeeded;
      }

      await adminClient
        .from('users')
        .update({ fan_xp: newXP, fan_level: newLevel })
        .eq('id', userId);

      // Check for new badges
      await checkAndAwardFanBadges(userId);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Log listening error:', error);
    const message = error instanceof Error ? error.message : 'Logging failed';
    return { success: false, error: message };
  }
}

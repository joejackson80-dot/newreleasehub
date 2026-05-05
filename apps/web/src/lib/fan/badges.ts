import { createAdminClient } from '@/lib/supabase/admin'

export const BADGE_DEFINITIONS = {
  DAY_ONE: { label: 'Day One', description: 'Early network adopter', icon: '🌟' },
  VERIFIED_LISTENER: { label: 'Verified Listener', description: '100+ high-fidelity streams', icon: '🎧' },
  EARLY_SUPPORTER: { label: 'Early Supporter', description: 'One of the first 100 supporters of an artist', icon: '🛡️' },
  CURATOR: { label: 'Curator', description: 'Built a library of 50+ tracks', icon: '📦' },
  STREAK_7: { label: '7-Day Streak', description: 'Consistent 7-day listening habit', icon: '🔥' },
  ELITE_AGENT: { label: 'Elite Agent', description: 'Reached Fan Level 10', icon: '👑' },
}

export async function checkAndAwardFanBadges(userId: string) {
  try {
    const supabase = createAdminClient();

    // 1. Fetch user data with related stats and subscriptions
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*, fan_listening_stats(*), supporter_subscriptions(*)')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user) return

    const currentBadges = new Set(Array.isArray(user.badges) ? user.badges : [])
    const newBadges: string[] = []

    const stats = user.fan_listening_stats?.[0];
    const subs = user.supporter_subscriptions || [];

    // 2. VERIFIED_LISTENER (100+ streams)
    if (stats && (stats.total_streams_all_time || 0) >= 100 && !currentBadges.has('VERIFIED_LISTENER')) {
      newBadges.push('VERIFIED_LISTENER')
    }

    // 3. STREAK_7
    if (stats && (stats.listening_streak || 0) >= 7 && !currentBadges.has('STREAK_7')) {
      newBadges.push('STREAK_7')
    }

    // 4. ELITE_AGENT (Level 10)
    if ((user.fan_level || 1) >= 10 && !currentBadges.has('ELITE_AGENT')) {
      newBadges.push('ELITE_AGENT')
    }

    // 5. EARLY_SUPPORTER (if they are a low supporterNumber)
    const hasEarlySub = subs.some((sub: any) => (sub.supporter_number || 999) <= 100)
    if (hasEarlySub && !currentBadges.has('EARLY_SUPPORTER')) {
      newBadges.push('EARLY_SUPPORTER')
    }

    if (newBadges.length > 0) {
      const updatedBadges = Array.from(new Set([...Array.from(currentBadges), ...newBadges]));
      
      await supabase
        .from('users')
        .update({ badges: updatedBadges })
        .eq('id', userId);
      
      console.log(`Awarded badges ${newBadges.join(', ')} to user ${userId}`)
    }
  } catch (error) {
    console.error('Error awarding fan badges:', error)
  }
}

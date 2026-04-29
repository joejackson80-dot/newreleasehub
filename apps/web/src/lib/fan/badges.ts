import { prisma } from '@/lib/prisma'

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        FanListeningStats: true,
        SupporterSubscriptions: true,
        StreamPlays: { take: 1 } // Just to check if they have any
      }
    })

    if (!user) return

    const currentBadges = new Set(user.badges)
    const newBadges: string[] = []

    // 1. VERIFIED_LISTENER (100+ streams)
    if (user.FanListeningStats && user.FanListeningStats.totalStreamsAllTime >= 100 && !currentBadges.has('VERIFIED_LISTENER')) {
      newBadges.push('VERIFIED_LISTENER')
    }

    // 2. STREAK_7
    if (user.FanListeningStats && user.FanListeningStats.listeningStreak >= 7 && !currentBadges.has('STREAK_7')) {
      newBadges.push('STREAK_7')
    }

    // 3. ELITE_AGENT (Level 10)
    if (user.fanLevel >= 10 && !currentBadges.has('ELITE_AGENT')) {
      newBadges.push('ELITE_AGENT')
    }

    // 4. EARLY_SUPPORTER (if they are a low supporterNumber)
    const hasEarlySub = user.SupporterSubscriptions.some(sub => sub.supporterNumber <= 100)
    if (hasEarlySub && !currentBadges.has('EARLY_SUPPORTER')) {
      newBadges.push('EARLY_SUPPORTER')
    }

    if (newBadges.length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          badges: {
            set: Array.from(new Set([...user.badges, ...newBadges]))
          }
        }
      })
      
      // We could also trigger a notification here
      console.log(`Awarded badges ${newBadges.join(', ')} to user ${userId}`)
    }
  } catch (error) {
    console.error('Error awarding fan badges:', error)
  }
}

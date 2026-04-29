'use server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { checkAndAwardFanBadges } from '@/lib/fan/badges';

export async function processFanCheckout(artistId: string, tierId: string) {
  try {
    // Note: Since authentication isn't fully implemented with NextAuth,
    // we will find or create a mock fan user to link the subscription to.
    let user = await prisma.user.findFirst({ where: { email: 'fan@example.com' } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'fan@example.com',
          displayName: 'SuperFan',
          username: 'superfan01',
        }
      });
    }

    const tier = await prisma.supporterTier.findUnique({ where: { id: tierId } });
    if (!tier) throw new Error("Tier not found");

    // Get current supporter count to assign the supporter number
    const currentCount = await prisma.supporterSubscription.count({
      where: { artistId }
    });

    const subscription = await prisma.supporterSubscription.create({
      data: {
        fanId: user.id,
        artistId,
        tierId,
        supporterNumber: currentCount + 1,
        priceCents: tier.priceCents,
        revenueSharePercent: tier.revenueSharePercent,
        status: 'ACTIVE',
      }
    });

    // Update the organization's supporter count
    await prisma.organization.update({
      where: { id: artistId },
      data: { supporterCount: { increment: 1 } }
    });

    // Award XP to the fan
    const userUpdate = await prisma.user.findUnique({ where: { id: user.id }, select: { fanXP: true, fanLevel: true } });
    if (userUpdate) {
       let newXP = userUpdate.fanXP + 500;
       let newLevel = userUpdate.fanLevel;
       const xpNeeded = newLevel * 500;
       if (newXP >= xpNeeded) {
          newLevel += 1;
          newXP -= xpNeeded;
       }
       await prisma.user.update({
          where: { id: user.id },
          data: { fanXP: newXP, fanLevel: newLevel }
       });
       
       // Check for new badges
       await checkAndAwardFanBadges(user.id);
    }

    // We can also create a mock transaction or yield logic later if needed.
    
    return { success: true, subscriptionId: subscription.id, supporterNumber: subscription.supporterNumber };
  } catch (error: any) {
    console.error('Fan checkout error:', error);
    return { success: false, error: error.message };
  }
}

export async function getFanFeed(userId: string) {
  try {
    // 1. Get the list of artists the user follows
    const follows = await prisma.follower.findMany({
      where: { userId },
      select: { organizationId: true }
    });
    
    const followingIds = follows.map(f => f.organizationId);
    
    // If following nothing, maybe show featured/latest globally?
    // For now, let's just get releases and posts from followed artists.
    
    const [releases, posts] = await Promise.all([
      prisma.release.findMany({
        where: { organizationId: { in: followingIds } },
        include: { Organization: true, Reactions: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.post.findMany({
        where: { organizationId: { in: followingIds } },
        include: { Organization: true, Reactions: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);
    
    // Merge and sort
    const feed = [
      ...releases.map(r => ({ ...r, type: 'release' })),
      ...posts.map(p => ({ ...p, type: 'post' }))
    ].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return { success: true, feed };
  } catch (error: any) {
    console.error('Fetch feed error:', error);
    return { success: false, error: error.message };
  }
}

export async function reactToRadio(stationSlug: string, reactionType: string) {
  try {
    const station = await prisma.station.findUnique({
      where: { slug: stationSlug },
      select: { nowPlayingId: true }
    });
    
    if (!station || !station.nowPlayingId) return { success: false, error: "No track currently playing" };
    
    // For demo, we'll use a mock fan user if no session
    let user = await prisma.user.findFirst({ where: { email: 'fan@example.com' } });
    if (!user) {
       user = await prisma.user.create({
          data: { email: 'fan@example.com', displayName: 'SuperFan', username: 'superfan01' }
       });
    }

    await prisma.reaction.create({
      data: {
        userId: user.id,
        releaseId: station.nowPlayingId,
        type: reactionType
      }
    });

    return { success: true };
  } catch (error: any) {
    // If it's a unique constraint error (user already reacted with this type to this track), just ignore it
    if (error.code === 'P2002') return { success: true };
    console.error('Radio reaction error:', error);
    return { success: false, error: error.message };
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
    const message = await prisma.directMessage.create({
      data: {
        text: data.text,
        senderUserId: data.senderUserId,
        senderOrgId: data.senderOrgId,
        receiverUserId: data.receiverUserId,
        receiverOrgId: data.receiverOrgId
      }
    });
    return { success: true, message };
  } catch (error: any) {
    console.error('Send DM error:', error);
    return { success: false, error: error.message };
  }
}

export async function getMessages(params: {
  userId?: string,
  orgId?: string
}) {
  try {
    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderUserId: params.userId },
          { receiverUserId: params.userId },
          { senderOrgId: params.orgId },
          { receiverOrgId: params.orgId }
        ]
      },
      include: {
        senderUser: true,
        senderOrg: true,
        receiverUser: true,
        receiverOrg: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, messages };
  } catch (error: any) {
    console.error('Get messages error:', error);
    return { success: false, error: error.message };
  }
}

export async function getVaultContent(userId: string) {
  try {
    // 1. Get the list of artists the user supports
    const subscriptions = await prisma.supporterSubscription.findMany({
      where: { fanId: userId, status: 'ACTIVE' },
      select: { artistId: true }
    });
    
    const supporterOfIds = subscriptions.map(s => s.artistId);
    
    // 2. Get all isSupporterOnly releases from these artists
    const exclusiveReleases = await prisma.release.findMany({
      where: { 
        organizationId: { in: supporterOfIds },
        isSupporterOnly: true
      },
      include: { Organization: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, releases: exclusiveReleases };
  } catch (error: any) {
    console.error('Fetch vault error:', error);
    return { success: false, error: error.message };
  }
}

export async function logListeningSession(userId: string, trackId: string) {
  try {
    // 1. Record the stream play
    const track = await prisma.musicAsset.findUnique({
      where: { id: trackId },
      select: { organizationId: true }
    });

    await prisma.streamPlay.create({
      data: {
        listenerId: userId,
        trackId: trackId,
        artistId: track?.organizationId || ''
      }
    });

    // 2. Update listening stats and streak
    const stats = await prisma.fanListeningStats.findUnique({ where: { fanId: userId } });
    let xpToAdd = 10; // Base XP for a stream

    if (stats) {
      const now = new Date();
      const lastPlayed = new Date(stats.lastListeningDate || 0);
      let newStreak = stats.listeningStreak;
      
      const diffDays = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
        xpToAdd += 50; // Streak bonus
      } else if (diffDays > 1) {
        newStreak = 1;
      }

      await prisma.fanListeningStats.update({
        where: { fanId: userId },
        data: {
          totalStreamsAllTime: { increment: 1 },
          totalListeningHrs: { increment: 0.05 }, // Mock 3 mins
          listeningStreak: newStreak,
          lastListeningDate: now
        }
      });
    } else {
      await prisma.fanListeningStats.create({
        data: {
          fanId: userId,
          totalStreamsAllTime: 1,
          totalListeningHrs: 0.05,
          listeningStreak: 1,
          lastListeningDate: new Date()
        }
      });
    }

    // 3. Update User XP and Level
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { fanXP: true, fanLevel: true } });
    if (user) {
      let newXP = user.fanXP + xpToAdd;
      let newLevel = user.fanLevel;
      
      // Basic leveling logic: Each level requires level * 500 XP
      const xpNeeded = newLevel * 500;
      if (newXP >= xpNeeded) {
        newLevel += 1;
        newXP -= xpNeeded;
      }

      await prisma.user.update({
        where: { id: userId },
        data: { fanXP: newXP, fanLevel: newLevel }
      });

      // Check for new badges
      await checkAndAwardFanBadges(userId);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Log listening error:', error);
    return { success: false, error: error.message };
  }
}

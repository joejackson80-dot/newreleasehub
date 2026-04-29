'use server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

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

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

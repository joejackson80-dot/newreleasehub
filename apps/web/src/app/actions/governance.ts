'use server';
import { prisma } from '@/lib/prisma';
import { getSessionFan } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function voteOnProposal(proposalId: string, voteType: 'YES' | 'NO') {
  try {
    const user = await getSessionFan();
    if (!user) return { success: false, error: 'Unauthorized' };

    // Check if already voted
    const existing = await prisma.vote.findUnique({
      where: {
        proposalId_userId: {
          proposalId,
          userId: user.id
        }
      }
    });

    if (existing) return { success: false, error: 'Already voted' };

    // Calculate weight based on fan level
    const weight = user.fanLevel || 1;

    await prisma.vote.create({
      data: {
        proposalId,
        userId: user.id,
        voteType,
        weight
      }
    });

    revalidatePath('/governance');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProposals() {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { gt: new Date() }
      },
      include: {
        Organization: {
          select: { name: true, profileImageUrl: true }
        },
        Votes: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            voteType: true,
            weight: true,
            createdAt: true,
            User: {
              select: { displayName: true }
            }
          }
        },
        _count: {
          select: { Votes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate weighted sums for each proposal
    const proposalsWithWeights = await Promise.all(proposals.map(async (p) => {
      const voteSums = await prisma.vote.groupBy({
        by: ['voteType'],
        where: { proposalId: p.id },
        _sum: { weight: true }
      });

      const yesWeight = voteSums.find(v => v.voteType === 'YES')?._sum?.weight || 0;
      const noWeight = voteSums.find(v => v.voteType === 'NO')?._sum?.weight || 0;
      const totalWeight = yesWeight + noWeight;

      return {
        ...p,
        yesWeight,
        noWeight,
        totalWeight,
        consensusPercent: totalWeight > 0 ? Math.round((yesWeight / totalWeight) * 100) : 0
      };
    }));

    return { success: true, proposals: proposalsWithWeights };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

'use server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function voteOnProposal(proposalId: string, voteType: 'YES' | 'NO') {
  try {
    const user = await getSessionUser();
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
        _count: {
          select: { Votes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, proposals };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

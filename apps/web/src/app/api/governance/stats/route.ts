import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalVotes = await prisma.vote.count();
    const activeProposals = await prisma.proposal.count({
      where: {
        status: 'ACTIVE',
        expiresAt: { gt: new Date() }
      }
    });

    // Calculate "Locked Equity" (total of all supporter subscription prices)
    const totalEquityCents = await prisma.supporterSubscription.aggregate({
      _sum: { priceCents: true },
      where: { status: 'ACTIVE' }
    });

    // Calculate "Consensus" (ratio of YES votes over total votes)
    const yesVotes = await prisma.vote.count({ where: { voteType: 'YES' } });
    const consensus = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalVotes,
        activeProposals,
        consensus: consensus.toFixed(1),
        lockedEquity: (totalEquityCents._sum.priceCents || 0) / 100
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

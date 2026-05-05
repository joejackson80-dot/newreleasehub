export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const fanId = await getSessionFanId();
    if (!fanId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const shares = await prisma.fanRoyaltyShare.findMany({
      where: { fanId },
      include: {
        Organization: {
          select: { name: true, slug: true, profileImageUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Grouping logic for yield overview
    const totalEarned = shares.reduce((sum, s) => sum + s.amountEarned, 0);
    const activePositions = shares.filter(s => s.status === 'CREDITED').length;

    // Simulate some recent payout events for high-fidelity UI
    const payouts = shares
      .filter(s => s.amountEarned > 0)
      .map(s => ({
        id: `payout-${s.id}`,
        artistName: s.Organization.name,
        amount: s.amountEarned,
        date: s.createdAt,
        type: 'STREAMS_YIELD'
      }));

    return NextResponse.json({ 
      success: true, 
      history: shares,
      stats: {
        totalEarned,
        activePositions,
        currency: 'USD'
      },
      recentPayouts: payouts
    });
  } catch (error: any) {
    console.error('Yield History API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFanId } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const fanId = await getSessionFanId();
    if (!fanId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const stats = await prisma.fanListeningStats.findUnique({
      where: { fanId }
    });

    // Calculate first discoveries (simplified: subscriptions made within 7 days of artist profile creation)
    const discoveries = await prisma.supporterSubscription.count({
      where: {
        fanId,
        status: 'ACTIVE',
        // In a real app, we'd join with Organization and check dates
      }
    });

    return NextResponse.json({ 
      success: true, 
      stats: {
        ...stats,
        firstDiscoveries: [] // Pending true real-time date logic implementation
      }
    });
  } catch (error: any) {
    console.error('Fan Stats API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


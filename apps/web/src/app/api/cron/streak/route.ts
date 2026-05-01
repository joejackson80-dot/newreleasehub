import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Secret to verify cron caller
const CRON_SECRET = process.env.CRON_SECRET || 'dev_cron_secret_123';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Find all fan listening stats where the last listening date was before yesterday
    // This means they skipped a full day, so their streak is broken.
    const result = await prisma.fanListeningStats.updateMany({
      where: {
        lastListeningDate: {
          lt: yesterday
        },
        listeningStreak: {
          gt: 0
        }
      },
      data: {
        listeningStreak: 0
      }
    });

    console.log(`[Cron] Reset ${result.count} broken listening streaks.`);

    return NextResponse.json({ success: true, resetCount: result.count });
  } catch (error: any) {
    console.error('Streak Decay Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

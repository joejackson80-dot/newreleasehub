import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  // Check for CRON_SECRET in production
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const expiredCount = await prisma.collabRequest.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        status: 'PENDING'
      },
      data: {
        status: 'EXPIRED'
      }
    });

    return NextResponse.json({
      success: true,
      expiredCount: expiredCount.count
    });
  } catch (error: any) {
    console.error('Collab expiration cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

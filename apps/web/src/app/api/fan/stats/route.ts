import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeError } from '@/lib/api/errors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(safeError('Missing userId', 400), { status: 400 });
    }

    const stats = await prisma.fanListeningStats.findUnique({
      where: { fanId: userId }
    });

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json(safeError(error), { status: 500 });
  }
}

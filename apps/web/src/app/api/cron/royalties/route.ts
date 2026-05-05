import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calculateMonthlyRoyalties } = await import('@/lib/private/royalties/calculateRoyalties');
    const report = await calculateMonthlyRoyalties();

    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    console.error('CRON Royalty Error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

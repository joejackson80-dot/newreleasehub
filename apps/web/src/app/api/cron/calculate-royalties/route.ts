import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { calculateMonthlyRoyalties } = await import('@/lib/private/royalties/calculateRoyalties');
    const report = await calculateMonthlyRoyalties();

    return NextResponse.json({
      success: true,
      month: report.month,
      year: report.year,
      artistCount: report.artistCount,
      payoutTotal: report.totalArtistPayout,
    });
  } catch (error: unknown) {
    console.error('Royalty Cron Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

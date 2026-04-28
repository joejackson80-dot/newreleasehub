import { NextResponse } from 'next/server';
import { calculateMonthlyRoyalties } from '@/lib/private/royalties/calculateRoyalties';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Basic verification of Vercel Cron header
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await calculateMonthlyRoyalties();
    
    return NextResponse.json({
      success: true,
      month: report.month,
      year: report.year,
      artistCount: report.artistCount,
      payoutTotal: report.totalArtistPayout,
    });
  } catch (error: any) {
    console.error('Royalty Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

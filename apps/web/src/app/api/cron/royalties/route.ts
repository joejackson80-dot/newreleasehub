import { NextResponse } from 'next/server';
import { calculateMonthlyRoyalties } from '@/lib/private/royalties/calculateRoyalties';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    // Vercel Cron Securing
    // Ensure only Vercel's Cron scheduler can hit this by verifying the auth header
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Trigger the royalty orchestration for the previous month
    const report = await calculateMonthlyRoyalties();

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('CRON Royalty Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

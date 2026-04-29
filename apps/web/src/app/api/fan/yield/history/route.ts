import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // ── INSTITUTIONAL ANALYTICS ENGINE ──
  // Fetching historical yield trend for the last 12 months
  // Using Supabase Data API for Edge compatibility
  const { data, error } = await supabase
    .from('FanRoyaltyShare')
    .select('month, year, amountEarned')
    .eq('fanId', userId)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(12);

  if (error) {
    console.error('[YIELD_ANALYTICS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch yield history' }, { status: 500 });
  }

  // Sort back to chronological for the chart
  const historicalData = data.reverse();

  return NextResponse.json({ 
    success: true,
    history: historicalData,
    protocol: 'NRH_ANALYTICS_V1.1'
  });
}



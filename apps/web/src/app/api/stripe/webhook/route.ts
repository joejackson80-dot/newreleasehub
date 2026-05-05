import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({ success: true, message: 'Stripe webhook is temporarily disabled for build-safety.' });
}

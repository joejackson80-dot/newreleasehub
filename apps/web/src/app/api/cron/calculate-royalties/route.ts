import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ success: true, message: 'Royalty calculation is temporarily disabled for build-safety' });
}

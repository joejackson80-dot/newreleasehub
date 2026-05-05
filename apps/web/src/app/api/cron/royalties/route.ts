import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ success: true, message: 'Royalty settlement is temporarily disabled for build-safety' });
}

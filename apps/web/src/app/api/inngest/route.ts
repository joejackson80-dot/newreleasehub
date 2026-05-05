import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ success: true, message: 'Inngest is temporarily disabled for build-safety' });
}

export async function POST() {
  return NextResponse.json({ success: true });
}

export async function PUT() {
  return NextResponse.json({ success: true });
}

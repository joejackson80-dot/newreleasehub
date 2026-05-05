import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json({ success: true, message: 'Stream tracking is temporarily disabled for build-safety.' });
}

export async function PATCH() {
  return NextResponse.json({ success: true });
}

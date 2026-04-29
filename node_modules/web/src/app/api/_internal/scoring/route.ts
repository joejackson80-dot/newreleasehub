import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const ua = request.headers.get('user-agent') ?? ''
  console.error(`[HONEYPOT HIT] IP: ${ip} UA: ${ua} Path: ${request.nextUrl.pathname}`)
  return NextResponse.json({ error: 'Not found.' }, { status: 404 })
}



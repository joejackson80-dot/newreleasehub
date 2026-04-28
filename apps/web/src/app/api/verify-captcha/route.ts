import { NextRequest, NextResponse } from 'next/server'
import { safeError } from '@/lib/api/errors'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    
    if (!process.env.TURNSTILE_SECRET_KEY) {
      // In development, allow bypass if key is missing
      return NextResponse.json({ success: true, message: 'Turnstile secret missing, bypassing in development' })
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      })
    })

    const data = await response.json()
    if (data.success) {
      // Mark user as human-verified for next 24 hours (e.g. via cookie or session)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(safeError(error), { status: 500 })
  }
}

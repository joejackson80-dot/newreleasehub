import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Next.js 16 Proxy — replaces the deprecated middleware.ts convention.
 * Runs on the Node.js runtime (no 1 MB Edge Function size limit).
 *
 * ⚠  This file must stay lightweight. Never import Prisma, bcrypt,
 *    or full auth adapters here — use getToken (JWT decode only).
 */

// ─── Honeypot traps — instant-block common vulnerability scanners ───
const HONEYPOTS = [
  '/wp-admin', '/.git', '/config', '/.env',
  '/xmlrpc.php', '/phpmyadmin', '/wp-login.php',
]

// ─── Bot user-agent patterns ───
const BOT_PATTERNS = [
  /python-requests/i, /scrapy/i, /wget/i, /go-http-client/i,
  /java\/[0-9]/i, /axios/i, /node-fetch/i, /curl/i, /libwww-perl/i,
]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // ── Honeypot check ──
  if (HONEYPOTS.some(hp => path.startsWith(hp) || path.includes(hp))) {
    console.warn(`[NRH HONEYPOT] Blocked request targeting: ${path}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── Bot detection on API routes ──
  const userAgent = request.headers.get('user-agent') ?? ''
  if (BOT_PATTERNS.some(p => p.test(userAgent)) && path.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Direct API access from automated scripts is prohibited.' },
      { status: 403 },
    )
  }

  // ── Rate limiting via Upstash (only when env vars present) ──
  // ⚠  /api/auth/* is intentionally excluded — NextAuth OAuth handshakes
  //    make 3-5 rapid internal requests which would trip any tight limiter.
  const isAuthRoute = path.startsWith('/api/auth')
  if (!isAuthRoute && process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    try {
      // Dynamic import keeps @upstash/* out of the initial bundle
      const { Ratelimit } = await import('@upstash/ratelimit')
      const { Redis } = await import('@upstash/redis')

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_URL,
        token: process.env.UPSTASH_REDIS_TOKEN,
      })

      let limiter: InstanceType<typeof Ratelimit>
      if (path.startsWith('/api/discovery') || path.startsWith('/api/charts')) {
        limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '60 s'), prefix: 'nrh:discovery' })
      } else if (path.startsWith('/api/studio/earnings') || path.startsWith('/api/royalties')) {
        limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '60 s'), prefix: 'nrh:royalties' })
      } else {
        limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '60 s'), prefix: 'nrh:general' })
      }

      const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
      const { success } = await limiter.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
      }
    } catch (err) {
      // Fail open — log the error but never block a request due to Redis failure
      console.warn('[NRH RATE LIMIT] Redis error, failing open:', err)
    }
  }

  // ── Auth checks via JWT token (no DB, no Prisma) ──
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Protect /studio/* routes
  if (path.startsWith('/studio')) {
    const isPublicStudio =
      path === '/studio/login' ||
      path === '/studio/register' ||
      path === '/studio/welcome'

    if (!isPublicStudio) {
      if (!token || token.role !== 'ARTIST') {
        return NextResponse.redirect(new URL('/studio/login', request.url))
      }
    }
  }

  // Protect /fan/me routes
  if (path.startsWith('/fan/me')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect /admin/* routes
  if (path.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico
     * - static assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL ?? '',
  token: process.env.UPSTASH_REDIS_TOKEN ?? '',
})

const limits = {
  discovery: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '60 s'), prefix: 'nrh:discovery' }),
  auth:      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '60 s'),  prefix: 'nrh:auth' }),
  royalties: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '60 s'), prefix: 'nrh:royalties' }),
  general:   new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '60 s'), prefix: 'nrh:general' }),
}

import { auth } from "@/auth"

export default auth(async function middleware(request) {
  const ip = (request as any).ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const path = request.nextUrl.pathname
  const session = request.auth;

  // Honeypot traps — instant block for common vulnerability scanners
  const honeypots = ['/wp-admin', '/admin', '/.git', '/config', '/.env', '/xmlrpc.php', '/phpmyadmin', '/wp-login.php'];
  if (honeypots.some(hp => path.startsWith(hp) || path.includes(hp))) {
    // Exception: /admin is a legitimate path in our app, so only block if it's a typical bot pattern or subpath
    if (path.startsWith('/admin') && path.length > 6) {
      console.warn(`[NRH HONEYPOT] Blocked IP ${ip} targeting sensitive path: ${path}`);
      return new NextResponse('Internal Server Error', { status: 403 });
    }
  }

  // Skip rate limiting if Redis env vars are missing (development safety)
  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    let limiter = limits.general
    if (path.startsWith('/api/discovery') || path.startsWith('/api/charts')) limiter = limits.discovery
    else if (path.startsWith('/api/auth')) limiter = limits.auth
    else if (path.startsWith('/api/studio/earnings') || path.startsWith('/api/royalties')) limiter = limits.royalties

    try {
      const { success } = await limiter.limit(ip)
      if (!success) {
        return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
      }
    } catch (err) {
      console.error('Rate limit error:', err)
    }
  }

  const userAgent = request.headers.get('user-agent') ?? ''
  const botPatterns = [/python-requests/i, /scrapy/i, /wget/i, /go-http-client/i, /java\/[0-9]/i, /axios/i, /node-fetch/i, /curl/i, /libwww-perl/i]
  if (botPatterns.some(p => p.test(userAgent)) && path.startsWith('/api/')) {
    return NextResponse.json({ error: 'Direct API access from automated scripts is prohibited.' }, { status: 403 })
  }

  // Protect /studio/* routes
  if (path.startsWith('/studio')) {
    const isPublicStudio = path === '/studio/login' || path === '/studio/register' || path === '/studio/welcome';
    if (!isPublicStudio) {
      if (!session) {
        return NextResponse.redirect(new URL('/studio/login', request.url));
      }
      // Optional: Check if role is ARTIST
      if ((session.user as any)?.role !== 'ARTIST') {
        // If a fan tries to access studio, send them back or show error
        // For now, redirect to login with error is complex in middleware, so just redirect to login
        return NextResponse.redirect(new URL('/studio/login', request.url));
      }
    }
  }

  // Protect /fan/me routes
  if (path.startsWith('/fan/me')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /admin/* routes
  if (path.startsWith('/admin')) {
    if ((session?.user as any)?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next()
})

export const config = { 
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ] 
}



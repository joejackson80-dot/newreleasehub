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

export async function proxy(request: NextRequest) {
  const ip = (request as any).ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
  const path = request.nextUrl.pathname

  // Honeypot traps — instant block for common vulnerability scanners
  const honeypots = ['/wp-admin', '/admin', '/.git', '/config', '/.env', '/xmlrpc.php', '/phpmyadmin', '/wp-login.php'];
  if (honeypots.some(hp => path.startsWith(hp) || path.includes(hp))) {
    console.warn(`[NRH HONEYPOT] Blocked IP ${ip} targeting sensitive path: ${path}`);
    return new NextResponse('Internal Server Error', { status: 403 });
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
  if (path.startsWith('/studio') && !path.startsWith('/studio/login') && !path.startsWith('/studio/register')) {
    const artistSession = request.cookies.get('nrh_artist_session');
    if (!artistSession) {
      return NextResponse.redirect(new URL('/studio/login', request.url));
    }
  }

  return NextResponse.next()
}

export const config = { 
  matcher: [
    '/api/:path*', 
    '/studio/:path*',
    '/wp-admin/:path*',
    '/admin/:path*',
    '/.git/:path*',
    '/config/:path*',
    '/.env',
    '/xmlrpc.php'
  ] 
}

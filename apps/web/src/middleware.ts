import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // SESSION COOKIE CHECK (Simplified for v1)
  const artistSession = request.cookies.get('artist_id');
  const fanSession = request.cookies.get('fan_id');
  const userRole = request.cookies.get('user_role')?.value;

  // 0.2 & 1.5 — Protect /studio/* routes
  if (pathname.startsWith('/studio')) {
    // Exclude login and welcome from protection
    if (pathname === '/studio/login' || pathname === '/studio/register' || pathname === '/studio/welcome') {
      return NextResponse.next();
    }

    if (!artistSession) {
      return NextResponse.redirect(new URL('/studio/login', request.url));
    }
  }

  // 1.5 — Protect /fan/me routes
  if (pathname.startsWith('/fan/me')) {
    if (!fanSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 1.5 — Protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'nrh_admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/studio/:path*',
    '/fan/me/:path*',
    '/admin/:path*',
  ],
};

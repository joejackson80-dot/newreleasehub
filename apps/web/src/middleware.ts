import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Build-time / missing env guard — let the request pass through
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // ─────────────────────────────────────────────
  // Public login pages — never redirect, even if authenticated
  // ─────────────────────────────────────────────
  const isLoginPage =
    pathname === '/login' ||
    pathname === '/studio/login' ||
    pathname === '/admin/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'

  if (isLoginPage) {
    return supabaseResponse
  }

  // ─────────────────────────────────────────────
  // Unauthenticated users — redirect to appropriate login
  // ─────────────────────────────────────────────
  if (!user) {
    if (pathname.startsWith('/studio')) {
      return NextResponse.redirect(new URL('/studio/login', request.url))
    }
    if (pathname.startsWith('/fan/me')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    // Allow all public routes through
    return supabaseResponse
  }

  // ─────────────────────────────────────────────
  // Authenticated users — enforce role-based portal separation
  // ─────────────────────────────────────────────
  const role = user.user_metadata?.role as string | undefined

  if (pathname.startsWith('/studio') && role !== 'artist') {
    return NextResponse.redirect(new URL('/studio/error/role-mismatch', request.url))
  }
  if (pathname.startsWith('/fan/me') && role !== 'fan') {
    return NextResponse.redirect(new URL('/studio', request.url))
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico
     * - public assets (svg, png, jpg, jpeg, gif, webp)
     * - api routes (handled by their own auth checks)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

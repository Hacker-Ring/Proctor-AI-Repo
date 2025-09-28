import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Try to get session first
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  // Only get user if we have a valid session
  let user = session?.user
  if (!user) {
    const {
      data: { user: userData },
    } = await supabase.auth.getUser()
    user = userData || undefined
  }

  // Debug: Log all cookies to see what's available
  const allCookies = req.cookies.getAll();
  const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));
  
  console.log('Middleware auth check:', { 
    path: req.nextUrl.pathname, 
    hasSession: !!session, 
    hasUser: !!user, 
    userId: user?.id,
    sessionUserId: session?.user?.id,
    totalCookies: allCookies.length,
    supabaseCookies: supabaseCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }))
  });

  // Log specific Supabase auth cookies
  const authCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));
  console.log('Auth cookies found:', authCookies.map(c => ({ name: c.name, hasValue: !!c.value })));

  // Allow debug page
  if (req.nextUrl.pathname.startsWith('/debug-auth')) {
    return response;
  }

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/calls') ||
      req.nextUrl.pathname.startsWith('/manage-data') ||
      req.nextUrl.pathname.startsWith('/analytics')) {
    if (!user) {
      console.log('Redirecting to signin - no authenticated user');
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }

  // Redirect authenticated users away from auth pages (except callback and reset-password)
  if (req.nextUrl.pathname.startsWith('/auth/') && 
      !req.nextUrl.pathname.startsWith('/auth/callback') &&
      !req.nextUrl.pathname.startsWith('/auth/reset-password') &&
      user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Don't redirect from home page - let it show conditional content
  // The home page will handle showing appropriate buttons based on auth state

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

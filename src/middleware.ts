import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware: Checking admin route access for:', req.nextUrl.pathname)
    
    if (!session) {
      console.log('Middleware: No session found, redirecting to login')
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('Middleware: Session found for user:', session.user.email)

    // Check if user has admin or operator role
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)

    console.log('Middleware: User roles found:', userRoles?.map(r => r.role))

    const hasAdminAccess = userRoles?.some(
      (role) => role.role === 'admin' || role.role === 'operator'
    )

    if (!hasAdminAccess) {
      console.log('Middleware: User does not have admin access')
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  // Protected user routes (profile, bookings, etc.)
  const protectedUserRoutes = ['/profile', '/bookings', '/account']
  
  if (protectedUserRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = new URL('/auth/login', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - admin (temporarily disabled for debugging)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api|auth|admin).*)',
  ],
}

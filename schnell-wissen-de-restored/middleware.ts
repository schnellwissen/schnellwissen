import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the request is for the admin dashboard
  if (pathname.startsWith('/dashboard-xy934k2_admin')) {
    // Allow access to login page
    if (pathname === '/dashboard-xy934k2_admin/login') {
      return NextResponse.next()
    }
    
    // Check authentication for all other admin routes
    const session = isAdminAuthenticated(request)
    
    console.log(`Middleware check for ${pathname}:`, {
      isAuthenticated: session.isAuthenticated,
      username: session.username
    })
    
    if (!session.isAuthenticated) {
      // Redirect to admin login page
      const loginUrl = new URL('/dashboard-xy934k2_admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      console.log(`Redirecting to login: ${loginUrl.toString()}`)
      return NextResponse.redirect(loginUrl)
    }
    
    // Admin is authenticated, allow access
    return NextResponse.next()
  }
  
  // For all other routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
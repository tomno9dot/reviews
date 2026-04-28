// proxy.js  ← ROOT of project (same level as package.json)

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Get token from request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ✅ Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/customers',
    '/analytics',
    '/settings',
    '/referrals',
  ];

  // ✅ Define auth routes (redirect if already logged in)
  const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
  ];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // ✅ Not logged in + trying to access protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Already logged in + trying to access auth route
  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL('/dashboard', request.url)
    );
  }

  return NextResponse.next();
}

// ✅ Config - which routes this runs on
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - api routes
     * - _next/static files
     * - _next/image files
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
// proxy.js - ROOT of project

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ✅ Must be named export called "proxy"
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ✅ Skip API routes - they handle their own auth
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // ✅ Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ✅ Get JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ✅ Protected routes - must be logged in
  const protectedRoutes = [
    '/dashboard',
    '/customers',
    '/reviews',
    '/analytics',
    '/settings',
    '/referrals',
  ];

  // ✅ Auth routes - only for logged OUT users
  const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ Not logged in + visiting protected page
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Already logged in + visiting auth page
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.css$|.*\\.js$).*)',
  ],
};
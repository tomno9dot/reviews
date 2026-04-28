// review-saas/middleware.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Skip ALL API routes - let them handle auth themselves
  if (pathname.startsWith('/api/')) {
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

  // ✅ Public pages - allow always
  const publicPages = ['/', '/login', '/register', '/forgot-password'];
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Protected dashboard pages - check NextAuth session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
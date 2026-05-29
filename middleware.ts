import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const middleware = withAuth(
  function middleware(req) {
    if (req.nextauth.token?.role === 'admin') {
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
      }
    }

    if (
      req.nextUrl.pathname.startsWith('/dashboard') &&
      !req.nextauth.token
    ) {
      return NextResponse.redirect(
        new URL('/login?callbackUrl=' + req.nextUrl.pathname, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*'],
};

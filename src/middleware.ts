import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/buyer') ||
    pathname.startsWith('/seller') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/checkout')
  ) {
    const token = req.cookies.get('farmmart_session_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const secret = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secret);

      const role = payload.role as string;

      if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      if (pathname.startsWith('/seller') && role !== 'SELLER' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/buyer/dashboard', req.url));
      }

      if (pathname.startsWith('/buyer') && role !== 'BUYER' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/seller/dashboard', req.url));
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch {

      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('farmmart_session_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/buyer/:path*', '/seller/:path*', '/admin/:path*', '/checkout/:path*'],
};

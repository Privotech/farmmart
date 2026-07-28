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

    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Pathname:', pathname);
    console.log('Token exists:', !!token);
    console.log('Token value:', token?.substring(0, 50) + '...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET?.substring(0, 10) + '...');

    if (!token) {
      console.log('NO TOKEN — redirecting to login');
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.log('NO JWT_SECRET — redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const secret = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secret);

      console.log('JWT verified successfully, payload:', payload);
      console.log('Role:', payload.role);

      const role = payload.role as string;

      if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        console.log('Not admin — redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url));
      }

      if (pathname.startsWith('/seller') && role !== 'SELLER' && role !== 'ADMIN') {
        console.log('Not seller — redirecting to buyer dashboard');
        return NextResponse.redirect(new URL('/buyer/dashboard', req.url));
      }

      if (pathname.startsWith('/buyer') && role !== 'BUYER' && role !== 'ADMIN') {
        console.log('Not buyer — redirecting to seller dashboard');
        return NextResponse.redirect(new URL('/seller/dashboard', req.url));
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', payload.role as string);

      console.log('=== MIDDLEWARE PASSED ===');

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (err: unknown) {
      console.error('=== JWT VERIFICATION FAILED ===');
      console.error(err);

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
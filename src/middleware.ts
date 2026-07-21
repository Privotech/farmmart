import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate Limiting (Basic in-memory check is tricky in Edge middleware, we'll do it in API routes)

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
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_for_farmmart_2026');
      const { payload } = await jwtVerify(token, secret);
      
      const role = payload.role as string;
      
      if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      
      if (pathname.startsWith('/seller') && role !== 'SELLER' && role !== 'ADMIN') {
        console.warn(`Unauthorized access attempt to seller path by role: ${role}`);
        return NextResponse.redirect(new URL('/login', req.url));
      }
      
      // Clone request headers to pass payload down if needed
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', payload.role as string);
      
      return NextResponse.next({
        request: {
           headers: requestHeaders,
        },
      });

    } catch (err: any) {
      console.error('🚨 JWT Verification failed in middleware:');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      // Token is invalid or expired
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


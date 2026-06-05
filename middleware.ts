import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Bypassing server-side authentication checking for localStorage-based mock environment.
  // The pages themselves protect their content client-side using user session status.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*'],
};


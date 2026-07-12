import { NextRequest, NextResponse } from 'next/server';

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

export function rateLimit(
  req: NextRequest,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes by default
): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const now = Date.now();
  
  let entry = store.get(ip);
  if (!entry) {
    entry = { count: 1, resetTime: now + windowMs };
    store.set(ip, entry);
    return null;
  }
  
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
    return null;
  }
  
  entry.count++;
  if (entry.count > limit) {
    return NextResponse.json(
      { success: false, error: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString() } }
    );
  }
  
  return null;
}

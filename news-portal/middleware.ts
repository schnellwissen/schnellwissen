import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const sub = host.split('.')[0];
  const res = NextResponse.next();
  if (sub && sub !== 'localhost') {
    res.headers.set('x-subdomain', sub);
  }
  return res;
}
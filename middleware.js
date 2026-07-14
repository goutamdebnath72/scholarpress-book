// middleware.js
import { auth } from './auth.js'; // Chapter 1
import { NextResponse } from 'next/server';

export default auth(function middleware(req) {
  // Stamp every request with a unique ID (Chapter 8 §8.4.1)
  // Web-standard crypto.randomUUID() is available in the Edge Runtime,
  // unlike Node's 'crypto' module.
  const requestId = crypto.randomUUID();
  const res = NextResponse.next();
  res.headers.set('x-request-id', requestId);

  return res;
});

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/(en|bn)/notes/:path*',
    '/(en|bn)/bookmarks/:path*',
    '/(en|bn)/dashboard',
  ],
};

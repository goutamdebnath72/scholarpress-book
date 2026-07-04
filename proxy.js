// proxy.js
import { NextResponse } from 'next/server';

const PROTECTED = ['/notes', '/bookmarks', '/dashboard'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('sp-session');

  // Auth gate (optimistic check; Volume II makes it real).
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !session) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Stamp every request with a unique id for the logger.
  // crypto.randomUUID() is available in the Edge Runtime,
  // unlike Node's 'crypto' module.
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
}

export const config = {
  matcher: [
    '/notes/:path*',
    '/bookmarks/:path*',
    '/dashboard',
  ],
}


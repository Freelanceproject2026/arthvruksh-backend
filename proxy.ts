import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/admin/login',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* and /docs
  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/docs');

  if (!isProtected) {
    return NextResponse.next();
  }

  // Allow login page
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check admin session cookie
  const sessionCookie = request.cookies.get(
    'arthvruksh_admin_session'
  );

  if (!sessionCookie) {
    const loginUrl = new URL(
      '/admin/login',
      request.url
    );

    loginUrl.searchParams.set(
      'redirect',
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/docs',
  ],
};
import { NextRequest } from 'next/server';

import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

import { getVisitorCount, incrementVisitorCount } from '@/lib/services/visitorCounter';

const VISITOR_SESSION_COOKIE = 'arthvruksh_visitor_session';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Visitor Count
   Increments once per browser session
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const alreadyCounted = request.cookies.has(VISITOR_SESSION_COOKIE);

    const count = alreadyCounted
      ? await getVisitorCount()
      : await incrementVisitorCount();

    const response = successResponse(origin, { count });

    if (!alreadyCounted) {
      // No maxAge/expires -> session cookie, cleared when the browser closes,
      // so the next browser session counts as a new visitor.
      response.cookies.set({
        name: VISITOR_SESSION_COOKIE,
        value: '1',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Visitor Count Fetch Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

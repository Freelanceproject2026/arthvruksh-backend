import { NextRequest } from 'next/server';

import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';
import { logAdminAction } from '@/lib/adminLog';

import { getSiteConfig, updateSipBook } from '@/lib/services/siteConfig';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET SIP Book
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const config = await getSiteConfig();

    return successResponse(origin, {
      sipBook: config.sipBook,
    });
  } catch (error) {
    console.error('SIP Book Fetch Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   PATCH SIP Book (Admin only)
---------------------------------------- */

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();

    const { sipBook } = body;

    if (typeof sipBook !== 'number' || !Number.isFinite(sipBook)) {
      return errorResponse(origin, 'sipBook must be a number', 400);
    }

    if (sipBook < 0) {
      return errorResponse(origin, 'sipBook must be greater than or equal to 0', 400);
    }

    const current = await getSiteConfig();
    const oldValue = current.sipBook;

    const updated = await updateSipBook(sipBook);

    await logAdminAction({
      request,
      admin: auth.admin,
      action: 'UPDATE',
      resource: 'SITE_CONFIG',
      details: {
        field: 'sipBook',
        oldValue,
        newValue: updated.sipBook,
      },
    });

    return successResponse(origin, {
      message: 'SIP Book updated successfully',
      sipBook: updated.sipBook,
    });
  } catch (error) {
    console.error('SIP Book Update Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

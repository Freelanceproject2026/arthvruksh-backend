import { NextRequest } from 'next/server';

import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';
import { logAdminAction } from '@/lib/adminLog';

import { getSiteConfig, updateAUM } from '@/lib/services/siteConfig';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET AUM
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const config = await getSiteConfig();

    return successResponse(origin, {
      aum: config.aum,
    });
  } catch (error) {
    console.error('AUM Fetch Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   PATCH AUM (Admin only)
---------------------------------------- */

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();

    const { aum } = body;

    const isValid =
      aum === null ||
      (typeof aum === 'number' && Number.isFinite(aum) && aum >= 0);

    if (!isValid) {
      return errorResponse(origin, 'aum must be null or a number greater than or equal to 0', 400);
    }

    const current = await getSiteConfig();
    const oldValue = current.aum;

    const updated = await updateAUM(aum);

    await logAdminAction({
      request,
      admin: auth.admin,
      action: 'UPDATE',
      resource: 'SITE_CONFIG',
      details: {
        field: 'aum',
        oldValue,
        newValue: updated.aum,
      },
    });

    return successResponse(origin, {
      message: 'AUM updated successfully',
      aum: updated.aum,
    });
  } catch (error) {
    console.error('AUM Update Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

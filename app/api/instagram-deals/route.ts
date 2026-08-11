import { NextRequest } from 'next/server';

import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

import { listActiveDeals, toPublicDeal } from '@/lib/services/instagramDeals/instagramDealService';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Latest Instagram Deals (Public)
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);

    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '12', 10), 1),
      100
    );

    const { deals, totalRecords } = await listActiveDeals({ page, limit });

    return successResponse(origin, {
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      },
      deals: deals.map(toPublicDeal),
    });
  } catch (error) {
    console.error('List Public Instagram Deals Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

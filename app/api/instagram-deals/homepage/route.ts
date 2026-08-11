import { NextRequest } from 'next/server';

import { connectDB } from '@/lib/mongodb';
import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

import { getHomepageDeals } from '@/lib/services/instagramDeals/instagramDealService';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Homepage Instagram Deals (Public)
   Combines the total active count and the
   latest 12 active deals in a single call.
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const { count, latestDeals } = await getHomepageDeals();

    return successResponse(origin, {
      count,
      latestDeals,
    });
  } catch (error) {
    console.error('Homepage Instagram Deals Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

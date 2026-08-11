import { NextRequest } from 'next/server';

import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

import { countActiveDeals } from '@/lib/services/instagramDeals/instagramDealService';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Total Instagram Deal Count (Public)
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const count = await countActiveDeals();

    return successResponse(origin, { count });
  } catch (error) {
    console.error('Count Instagram Deals Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

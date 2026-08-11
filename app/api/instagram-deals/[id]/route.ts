import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

import { connectDB } from '@/lib/mongodb';
import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

import { getActiveDealById, toPublicDeal } from '@/lib/services/instagramDeals/instagramDealService';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Single Instagram Deal (Public)
---------------------------------------- */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid deal id', 400);
    }

    const deal = await getActiveDealById(id);

    if (!deal) {
      return errorResponse(origin, 'Instagram deal not found', 404);
    }

    return successResponse(origin, { deal: toPublicDeal(deal) });
  } catch (error) {
    console.error('Get Public Instagram Deal Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

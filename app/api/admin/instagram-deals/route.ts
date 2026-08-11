import { NextRequest } from 'next/server';

import { connectDB } from '@/lib/mongodb';
import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, paginatedResponse, successResponse } from '@/lib/response/apiResponse';
import { logAdminAction } from '@/lib/adminLog';

import { InstagramDealStatus } from '@/models/InstagramDeal';
import {
  validateCreatePayload,
  isDuplicateInstagramUrl,
  isFeaturedLimitReached,
  MAX_FEATURED_DEALS,
} from '@/lib/services/instagramDeals/instagramDealValidation';
import { createDeal, listDeals } from '@/lib/services/instagramDeals/instagramDealService';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   POST Create Instagram Deal (Admin only)
---------------------------------------- */

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();

    const validation = validateCreatePayload(body);

    if (!validation.valid) {
      return errorResponse(origin, validation.message, 400);
    }

    const instagramUrl = (body.instagramUrl as string).trim();

    const isDuplicate = await isDuplicateInstagramUrl(instagramUrl);

    if (isDuplicate) {
      return errorResponse(origin, 'This Instagram URL has already been added', 409);
    }

    if (body.featured === true && (await isFeaturedLimitReached())) {
      return errorResponse(
        origin,
        `Maximum of ${MAX_FEATURED_DEALS} featured deals allowed. Unfeature another deal first.`,
        400
      );
    }

    const deal = await createDeal({
      instagramUrl,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl,
      displayOrder: body.displayOrder,
      featured: body.featured,
      createdBy: auth.admin.id,
    });

    await logAdminAction({
      request,
      admin: auth.admin,
      action: 'CREATE',
      resource: 'INSTAGRAM_DEAL',
      resourceId: deal._id.toString(),
      details: {
        instagramUrl: deal.instagramUrl,
      },
    });

    return successResponse(
      origin,
      {
        message: 'Instagram deal created',
        deal,
      },
      201
    );
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return errorResponse(origin, 'This Instagram URL has already been added', 409);
    }

    console.error('Create Instagram Deal Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   GET All Instagram Deals (Admin only)
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);

    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '20', 10), 1),
      100
    );

    const search = searchParams.get('search')?.trim() || '';

    const statusParam = searchParams.get('status');

    const status: InstagramDealStatus | undefined =
      statusParam === 'active' || statusParam === 'inactive' ? statusParam : undefined;

    const { deals, totalRecords } = await listDeals({
      page,
      limit,
      search: search || undefined,
      status,
    });

    return paginatedResponse(
      origin,
      deals,
      {
        page,
        limit,
        count: deals.length,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      },
      {
        filters: {
          search,
          status: status ?? null,
        },
      }
    );
  } catch (error) {
    console.error('List Instagram Deals Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

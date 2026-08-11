import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

import { connectDB } from '@/lib/mongodb';
import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';
import { logAdminAction } from '@/lib/adminLog';

import {
  validateUpdatePayload,
  isDuplicateInstagramUrl,
  isFeaturedLimitReached,
  MAX_FEATURED_DEALS,
} from '@/lib/services/instagramDeals/instagramDealValidation';
import {
  getDealById,
  softDeleteDeal,
  updateDeal,
} from '@/lib/services/instagramDeals/instagramDealService';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Single Instagram Deal (Admin only)
---------------------------------------- */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid deal id', 400);
    }

    const deal = await getDealById(id);

    if (!deal) {
      return errorResponse(origin, 'Instagram deal not found', 404);
    }

    return successResponse(origin, { deal });
  } catch (error) {
    console.error('Get Instagram Deal Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   PUT Update Instagram Deal (Admin only)
---------------------------------------- */

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid deal id', 400);
    }

    const existing = await getDealById(id);

    if (!existing) {
      return errorResponse(origin, 'Instagram deal not found', 404);
    }

    const body = await request.json();

    const validation = validateUpdatePayload(body);

    if (!validation.valid) {
      return errorResponse(origin, validation.message, 400);
    }

    if (body.instagramUrl !== undefined) {
      const isDuplicate = await isDuplicateInstagramUrl(body.instagramUrl.trim(), id);

      if (isDuplicate) {
        return errorResponse(origin, 'This Instagram URL has already been added', 409);
      }
    }

    const resultingStatus = body.status !== undefined ? body.status : existing.status;
    const resultingFeatured = body.featured !== undefined ? body.featured : existing.featured;

    const wasActiveAndFeatured = existing.status === 'active' && existing.featured === true;
    const willBeActiveAndFeatured = resultingStatus === 'active' && resultingFeatured === true;

    if (willBeActiveAndFeatured && !wasActiveAndFeatured && (await isFeaturedLimitReached(id))) {
      return errorResponse(
        origin,
        `Maximum of ${MAX_FEATURED_DEALS} featured deals allowed. Unfeature another deal first.`,
        400
      );
    }

    const deal = await updateDeal(id, {
      instagramUrl: body.instagramUrl,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl,
      status: body.status,
      displayOrder: body.displayOrder,
      featured: body.featured,
    });

    if (!deal) {
      return errorResponse(origin, 'Instagram deal not found', 404);
    }

    await logAdminAction({
      request,
      admin: auth.admin,
      action: 'UPDATE',
      resource: 'INSTAGRAM_DEAL',
      resourceId: id,
      details: {
        updatedFields: Object.keys(body),
      },
    });

    return successResponse(origin, {
      message: 'Instagram deal updated',
      deal,
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return errorResponse(origin, 'This Instagram URL has already been added', 409);
    }

    console.error('Update Instagram Deal Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   DELETE Instagram Deal (Admin only)
   Soft delete: status -> inactive
---------------------------------------- */

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid deal id', 400);
    }

    const deal = await softDeleteDeal(id);

    if (!deal) {
      return errorResponse(origin, 'Instagram deal not found', 404);
    }

    await logAdminAction({
      request,
      admin: auth.admin,
      action: 'DELETE',
      resource: 'INSTAGRAM_DEAL',
      resourceId: id,
      details: {
        instagramUrl: deal.instagramUrl,
      },
    });

    return successResponse(origin, {
      message: 'Instagram deal deleted successfully',
    });
  } catch (error) {
    console.error('Delete Instagram Deal Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

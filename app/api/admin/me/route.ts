import { NextRequest } from 'next/server';
import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

export const OPTIONS = preflight;

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  const auth = await requireAdmin();

  if (!auth.authorized) {
    return errorResponse(origin, 'Unauthorized', 401);
  }

  return successResponse(origin, {
    admin: auth.admin,
  });
}
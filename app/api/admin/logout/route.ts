import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { preflight } from '@/lib/cors';
import { successResponse } from '@/lib/response/apiResponse';

export const OPTIONS = preflight;

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  const session = await getSession();

  session.destroy();

  return successResponse(origin, {
    message: 'Logged out successfully',
  });
}
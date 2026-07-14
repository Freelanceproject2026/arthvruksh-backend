import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const body = await request.json();
    const { mobile } = body;

    const sanitizedMobile = mobile?.trim();

    if (!sanitizedMobile) {
      return errorResponse(origin, 'Mobile number is required', 400);
    }

    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return errorResponse(origin, 'Invalid mobile number', 400);
    }

    const user = await User.findOne({
      mobile: sanitizedMobile,
    }).lean();

    if (!user) {
      return errorResponse(origin, 'User not found', 404);
    }

    return successResponse(origin, {
      message: 'User found',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login API Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { corsResponse, preflight } from '@/lib/cors';

export const OPTIONS = preflight;

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const body = await request.json();
    const { mobile } = body;

    const sanitizedMobile = mobile?.trim();

    if (!sanitizedMobile) {
      return corsResponse(
        {
          success: false,
          message: 'Mobile number is required',
        },
        400,
        origin
      );
    }

    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return corsResponse(
        {
          success: false,
          message: 'Invalid mobile number',
        },
        400,
        origin
      );
    }

    const user = await User.findOne({
      mobile: sanitizedMobile,
    }).lean();

    if (!user) {
      return corsResponse(
        {
          success: false,
          message: 'User not found',
        },
        404,
        origin
      );
    }

    return corsResponse(
      {
        success: true,
        message: 'User found',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          isVerified: user.isVerified,
        },
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Login API Error:', error);

    return corsResponse(
      {
        success: false,
        message: 'Internal Server Error',
      },
      500,
      origin
    );
  }
}
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

    const { fullName, email, mobile } = body;

    const sanitizedFullName = fullName?.trim();
    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedMobile = mobile?.trim();

    if (!sanitizedFullName || !sanitizedEmail || !sanitizedMobile) {
      return errorResponse(origin, 'fullName, email and mobile are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      return errorResponse(origin, 'Invalid email address', 400);
    }

    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return errorResponse(origin, 'Invalid mobile number', 400);
    }

    const existingEmail = await User.findOne({ email: sanitizedEmail });
    if (existingEmail) {
      return errorResponse(origin, 'Email is already registered', 409);
    }

    const existingMobile = await User.findOne({ mobile: sanitizedMobile });
    if (existingMobile) {
      return errorResponse(origin, 'Mobile number is already registered', 409);
    }

    const user = await User.create({
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      mobile: sanitizedMobile,
    });

    return successResponse(origin, {
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
      },
    }, 201);
  } catch (error) {
    console.error('Register API Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
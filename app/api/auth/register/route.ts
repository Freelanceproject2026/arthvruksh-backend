import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { corsResponse, preflight } from '@/lib/cors';

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
      return corsResponse(
        {
          success: false,
          message: 'fullName, email and mobile are required',
        },
        400,
        origin
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      return corsResponse(
        {
          success: false,
          message: 'Invalid email address',
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

    const existingEmail = await User.findOne({ email: sanitizedEmail });
    if (existingEmail) {
      return corsResponse(
        {
          success: false,
          message: 'Email is already registered',
        },
        409,
        origin
      );
    }

    const existingMobile = await User.findOne({ mobile: sanitizedMobile });
    if (existingMobile) {
      return corsResponse(
        {
          success: false,
          message: 'Mobile number is already registered',
        },
        409,
        origin
      );
    }

    const user = await User.create({
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      mobile: sanitizedMobile,
    });

    return corsResponse(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          isVerified: user.isVerified,
        },
      },
      201,
      origin
    );
  } catch (error) {
    console.error('Register API Error:', error);

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
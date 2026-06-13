import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const { mobile } = body;

    const sanitizedMobile =
      mobile?.trim();

    if (!sanitizedMobile) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Mobile number is required',
        },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid mobile number',
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      mobile: sanitizedMobile,
    }).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
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
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Login API Error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
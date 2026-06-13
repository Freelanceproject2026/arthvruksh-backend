import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      fullName,
      email,
      mobile,
    } = body;

    // Sanitize input
    const sanitizedFullName = fullName?.trim();
    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedMobile = mobile?.trim();

    // Required validation
    if (
      !sanitizedFullName ||
      !sanitizedEmail ||
      !sanitizedMobile
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'fullName, email and mobile are required',
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Mobile validation
    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid mobile number',
        },
        { status: 400 }
      );
    }

    // Check email duplicate
    const existingEmail =
      await User.findOne({
        email: sanitizedEmail,
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Email is already registered',
        },
        { status: 409 }
      );
    }

    // Check mobile duplicate
    const existingMobile =
      await User.findOne({
        mobile: sanitizedMobile,
      });

    if (existingMobile) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Mobile number is already registered',
        },
        { status: 409 }
      );
    }

    const user = await User.create({
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      mobile: sanitizedMobile,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          'User registered successfully',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          isVerified: user.isVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      'Register API Error:',
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
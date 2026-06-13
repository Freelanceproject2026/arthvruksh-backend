import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserAssessment from '@/models/UserAssessment';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      fullName,
      email,
      mobile,
    } = body;

    // Remove extra spaces
    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedMobile = mobile?.trim();
    const sanitizedFullName = fullName?.trim();

    // Required field validation
    if ( !sanitizedFullName || !sanitizedEmail || !sanitizedMobile ) {
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

    // Mobile validation (10 digits)
    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid mobile number',
        },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingUser =
      await UserAssessment.findOne({
        email: sanitizedEmail,
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Assessment already submitted with this email',
        },
        { status: 409 }
      );
    }

    // Save to MongoDB

    await UserAssessment.create({
      ...body,
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      mobile: sanitizedMobile,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Assessment saved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Assessment Save Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const assessments =
      await UserAssessment.find({})
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json(
      {
        success: true,
        count: assessments.length,
        data: assessments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Assessment Fetch Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
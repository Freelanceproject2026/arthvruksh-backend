import { NextRequest, NextResponse } from 'next/server';
import { corsResponse, preflight } from '@/lib/cors';
import { connectDB } from '@/lib/mongodb';
import UserAssessment from '@/models/UserAssessment';

export const OPTIONS = preflight;

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const body = await request.json();

    const { fullName, email, mobile } = body;

    // Remove extra spaces
    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedMobile = mobile?.trim();
    const sanitizedFullName = fullName?.trim();

    // Required field validation
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

    // Email validation
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

    // Mobile validation (10 digits)
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

    // Check duplicate email
    const existingUser = await UserAssessment.findOne({
      email: sanitizedEmail,
    });

    if (existingUser) {
      return corsResponse(
        {
          success: false,
          message: 'Assessment already submitted with this email',
        },
        409,
        origin
      );
    }

    // Save to MongoDB
    await UserAssessment.create({
      ...body,
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      mobile: sanitizedMobile,
    });

    return corsResponse(
      {
        success: true,
        message: 'Assessment saved successfully',
      },
      201,
      origin
    );
  } catch (error) {
    console.error('Assessment Save Error:', error);

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

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const assessments = await UserAssessment.find({})
      .sort({ createdAt: -1 })
      .lean();

    return corsResponse(
      {
        success: true,
        count: assessments.length,
        data: assessments,
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Assessment Fetch Error:', error);

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
import { NextRequest } from 'next/server';
import { preflight } from '@/lib/cors';
import { connectDB } from '@/lib/mongodb';
import UserAssessment from '@/models/UserAssessment';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import User from '@/models/User';
import { errorResponse, paginatedResponse, successResponse } from '@/lib/response/apiResponse';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   Assessment Query Type
---------------------------------------- */

type AssessmentQuery = {
  $or?: Array<{
    fullName?: {
      $regex: string;
      $options: string;
    };
    email?: {
      $regex: string;
      $options: string;
    };
    mobile?: {
      $regex: string;
      $options: string;
    };
    pan?: {
      $regex: string;
      $options: string;
    };
  }>;

  riskProfile?: string;
};

/* ----------------------------------------
   POST Assessment
---------------------------------------- */

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const body = await request.json();

    const { fullName, email, mobile } = body;

    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedMobile = mobile?.trim();
    const sanitizedFullName = fullName?.trim();

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

    // Find the registered user
    const user = await User.findOne({
      email: sanitizedEmail,
    });

    if (!user) {
      return errorResponse(origin, 'User is not registered', 404);
    }

    // Check if assessment already exists
    const existingAssessment = await UserAssessment.findOne({
      userId: user._id,
    });

    if (existingAssessment) {
      return errorResponse(origin, 'Assessment already submitted', 409);
    }

    await UserAssessment.create({
      ...body,
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
    });

    return successResponse(origin, {
      message: 'Assessment saved successfully',
    }, 201);
  } catch (error) {
    console.error('Assessment Save Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   GET Assessments
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(
      parseInt(searchParams.get('page') || '1', 10),
      1
    );

    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '20', 10), 1),
      100
    );

    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get('search')?.trim() || '';
    const risk = searchParams.get('risk')?.trim() || '';

    // Sorting
    const allowedSortFields = [
      'createdAt',
      'fullName',
      'age',
      'annualIncome',
      'totalScore',
      'riskProfile',
    ];

    const requestedSort = searchParams.get('sortBy') || 'createdAt';

    const sortBy = allowedSortFields.includes(requestedSort)
      ? requestedSort
      : 'createdAt';

    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Mongo Query
    const query: AssessmentQuery = {};

    if (search) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          mobile: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          pan: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    if (risk) {
      query.riskProfile = risk;
    }

    const [assessments, totalRecords] = await Promise.all([
      UserAssessment.find(query)
        .select('-__v')
        .sort({
          [sortBy]: order,
        })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserAssessment.countDocuments(query),
    ]);

    return paginatedResponse(
      origin,
      assessments,
      {
        page,
        limit,
        count: assessments.length,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      },
      {
        filters: {
          search,
          risk,
        },
        sorting: {
          sortBy,
          order: order === 1 ? 'asc' : 'desc',
        },
      }
    );
  } catch (error) {
    console.error('Assessment Fetch Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, paginatedResponse } from '@/lib/response/apiResponse';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* -----------------------------
   User Query Type
----------------------------- */

type UserQuery = {
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
  }>;

  isVerified?: boolean;
};

/* -----------------------------
   GET Users
----------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);

    // -----------------------------
    // Pagination
    // -----------------------------
    const page = Math.max(
      parseInt(searchParams.get('page') || '1', 10),
      1
    );

    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '20', 10), 1),
      100
    );

    const skip = (page - 1) * limit;

    // -----------------------------
    // Filters
    // -----------------------------
    const search = searchParams.get('search')?.trim() || '';
    const verified = searchParams.get('verified');

    // -----------------------------
    // Sorting
    // -----------------------------
    const allowedSortFields = [
      'createdAt',
      'fullName',
      'email',
      'mobile',
      'isVerified',
      'lastLogin',
    ];

    const requestedSort = searchParams.get('sortBy') || 'createdAt';

    const sortBy = allowedSortFields.includes(requestedSort)
      ? requestedSort
      : 'createdAt';

    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // -----------------------------
    // Mongo Query
    // -----------------------------
    const query: UserQuery = {};

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
      ];
    }

    if (verified === 'true') {
      query.isVerified = true;
    }

    if (verified === 'false') {
      query.isVerified = false;
    }

    // -----------------------------
    // Fetch Data
    // -----------------------------
    const [users, totalRecords] = await Promise.all([
      User.find(query)
        .select('-__v')
        .sort({
          [sortBy]: order,
        })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // -----------------------------
    // Response
    // -----------------------------
    return paginatedResponse(
      origin,
      users,
      {
        page,
        limit,
        count: users.length,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
      },
      {
        filters: {
          search,
          verified,
        },
        sorting: {
          sortBy,
          order: order === 1 ? 'asc' : 'desc',
        },
      }
    );
  } catch (error) {
    console.error('Get Users Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
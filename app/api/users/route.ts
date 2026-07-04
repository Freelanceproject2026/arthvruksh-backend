import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { corsResponse, preflight } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .lean();

    return corsResponse(
      {
        success: true,
        count: users.length,
        data: users,
      },
      200,
      origin
    );
  } catch (error) {
    console.error('Get Users Error:', error);

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
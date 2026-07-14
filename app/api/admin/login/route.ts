import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyPassword } from '@/lib/auth/password';
import { getSession } from '@/lib/auth/session';
import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

export const OPTIONS = preflight;

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse(origin, 'Email and password are required', 400);
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin) {
      return errorResponse(origin, 'Invalid credentials', 401);
    }

    const validPassword = await verifyPassword(
      password,
      admin.passwordHash
    );

    if (!validPassword) {
      return errorResponse(origin, 'Invalid credentials', 401);
    }

    const session = await getSession();

    session.admin = {
      id: admin._id.toString(),
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    };

    session.isLoggedIn = true;

    await session.save();

    admin.lastLogin = new Date();
    await admin.save();

    return successResponse(origin, {
      message: 'Login successful',
      admin: session.admin,
    });
  } catch (error) {
    console.error(error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
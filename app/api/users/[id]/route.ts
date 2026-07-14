import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

import { preflight } from '@/lib/cors';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth/requireAdmin';

import User from '@/models/User';
import UserAssessment from '@/models/UserAssessment';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid user id', 400);
    }

    const user = await User.findById(id).select('-__v').lean();

    if (!user) {
      return errorResponse(origin, 'User not found', 404);
    }

    const assessment = await UserAssessment.findOne({
      userId: user._id,
    })
      .select('-__v')
      .lean();

    return successResponse(origin, {
      data: {
        user,
        assessment,
        hasAssessment: !!assessment,
      },
    });
  } catch (error) {
    console.error(error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid user id', 400);
    }

    const body = await request.json();

    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const mobile = body.mobile?.trim();

    if (!fullName || !email || !mobile) {
      return errorResponse(origin, 'fullName, email and mobile are required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return errorResponse(origin, 'Invalid email address', 400);
    }

    if (!/^\d{10}$/.test(mobile)) {
      return errorResponse(origin, 'Invalid mobile number', 400);
    }

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(origin, 'User not found', 404);
    }

    const duplicateEmail = await User.findOne({
      email,
      _id: {
        $ne: id,
      },
    });

    if (duplicateEmail) {
      return errorResponse(origin, 'Email already exists', 409);
    }

    const duplicateMobile = await User.findOne({
      mobile,
      _id: {
        $ne: id,
      },
    });

    if (duplicateMobile) {
      return errorResponse(origin, 'Mobile number already exists', 409);
    }

    user.fullName = fullName;
    user.email = email;
    user.mobile = mobile;

    if (typeof body.isVerified === 'boolean') {
      user.isVerified = body.isVerified;
    }

    await user.save();

    await UserAssessment.updateMany(
      {
        userId: user._id,
      },
      {
        $set: {
          fullName,
          email,
          mobile,
        },
      }
    );

    return successResponse(origin, {
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(origin, 'Invalid user id', 400);
    }

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(origin, 'User not found', 404);
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      await UserAssessment.deleteMany({ userId: user._id }, { session });

      await User.deleteOne({ _id: user._id }, { session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return successResponse(origin, {
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete User Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
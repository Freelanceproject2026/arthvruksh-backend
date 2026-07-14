import { NextRequest } from 'next/server';

import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { preflight } from '@/lib/cors';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';

import User from '@/models/User';
import UserAssessment from '@/models/UserAssessment';

export const OPTIONS = preflight;

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    await connectDB();

    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      usersToday,
      usersWeek,
      usersMonth,
      totalAssessments,
      assessmentsToday,
      assessmentsWeek,
      lowRisk,
      moderateRisk,
      highRisk,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        isVerified: true,
      }),
      User.countDocuments({
        isVerified: false,
      }),
      User.countDocuments({
        createdAt: {
          $gte: todayStart,
        },
      }),
      User.countDocuments({
        createdAt: {
          $gte: weekStart,
        },
      }),
      User.countDocuments({
        createdAt: {
          $gte: monthStart,
        },
      }),
      UserAssessment.countDocuments(),
      UserAssessment.countDocuments({
        createdAt: {
          $gte: todayStart,
        },
      }),
      UserAssessment.countDocuments({
        createdAt: {
          $gte: weekStart,
        },
      }),
      UserAssessment.countDocuments({
        riskProfile: 'Low',
      }),
      UserAssessment.countDocuments({
        riskProfile: 'Moderate',
      }),
      UserAssessment.countDocuments({
        riskProfile: 'High',
      }),
    ]);

    return successResponse(origin, {
      generatedAt: now,
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          newToday: usersToday,
          newThisWeek: usersWeek,
          newThisMonth: usersMonth,
        },
        assessments: {
          total: totalAssessments,
          completedToday: assessmentsToday,
          completedThisWeek: assessmentsWeek,
        },
        riskProfiles: {
          low: lowRisk,
          moderate: moderateRisk,
          high: highRisk,
        },
      },
    });
  } catch (error) {
    console.error('Dashboard Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}
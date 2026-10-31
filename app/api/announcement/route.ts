import { NextRequest } from 'next/server';

import { preflight } from '@/lib/cors';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { errorResponse, successResponse } from '@/lib/response/apiResponse';
import { logAdminAction } from '@/lib/adminLog';

import { getSiteConfig, updateAnnouncement, AnnouncementUpdate } from '@/lib/services/siteConfig';

export async function OPTIONS(request: NextRequest) {
  return preflight(request);
}

/* ----------------------------------------
   GET Announcement Bar
---------------------------------------- */

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const config = await getSiteConfig();

    return successResponse(origin, {
      announcement: config.announcement,
    });
  } catch (error) {
    console.error('Announcement Fetch Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

/* ----------------------------------------
   PATCH Announcement Bar (Admin only)
---------------------------------------- */

const STRING_FIELDS = [
  'badge',
  'highlight',
  'message',
  'statValue',
  'statLabel',
  'ctaLabel',
  'ctaHref',
  'subText',
] as const;

export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const auth = await requireAdmin(origin);

    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const update: AnnouncementUpdate = {};

    if (body.enabled !== undefined) {
      if (typeof body.enabled !== 'boolean') {
        return errorResponse(origin, 'enabled must be a boolean', 400);
      }
      update.enabled = body.enabled;
    }

    for (const field of STRING_FIELDS) {
      const value = body[field];
      if (value === undefined) continue;
      if (typeof value !== 'string') {
        return errorResponse(origin, `${field} must be a string`, 400);
      }
      update[field] = value.trim();
    }

    // badge and message are the two fields always visible when the bar is
    // enabled, so (unlike the optional highlight/stat/CTA) they may never be
    // blanked out.
    if (update.badge === '') {
      return errorResponse(origin, 'badge cannot be empty', 400);
    }
    if (update.message === '') {
      return errorResponse(origin, 'message cannot be empty', 400);
    }

    if (Object.keys(update).length === 0) {
      return errorResponse(origin, 'Provide at least one announcement field to update', 400);
    }

    const current = await getSiteConfig();
    const oldValue = current.announcement;

    const updated = await updateAnnouncement(update);

    await logAdminAction({
      request,
      admin: auth.admin,
      action: 'UPDATE',
      resource: 'SITE_CONFIG',
      details: {
        field: 'announcement',
        oldValue,
        newValue: updated.announcement,
      },
    });

    return successResponse(origin, {
      message: 'Announcement updated successfully',
      announcement: updated.announcement,
    });
  } catch (error) {
    console.error('Announcement Update Error:', error);

    return errorResponse(origin, 'Internal Server Error', 500);
  }
}

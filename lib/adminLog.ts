import { NextRequest } from 'next/server';
import type { AdminAction, AdminResource, } from '@/models/AdminLog';
import AdminLog from '@/models/AdminLog';

interface LogAdminActionParams {
  request: NextRequest;

  admin: {
    id: string;
    fullName: string;
    email: string;
  };

  action: AdminAction;

  resource: AdminResource;

  resourceId?: string;

  details?: Record<string, unknown>;
}

export async function logAdminAction({
  request,
  admin,
  action,
  resource,
  resourceId,
  details = {},
}: LogAdminActionParams) {
  await AdminLog.create({
    adminId: admin.id,

    adminName: admin.fullName,

    adminEmail: admin.email,

    action,

    resource,

    resourceId,

    details,

    ipAddress:
      request.headers.get('x-forwarded-for') ??
      request.headers.get('x-real-ip') ??
      '',

    userAgent:
      request.headers.get('user-agent') ?? '',
  });
}
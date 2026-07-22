import Admin from '@/models/Admin';
import { getSession } from './session';
import { corsResponse } from '@/lib/cors';

export async function requireAdmin(origin?: string | null) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.admin) {
    return {
      authorized: false as const,
      response: corsResponse(
        {
          success: false,
          message: 'Unauthorized',
        },
        401,
        origin
      ),
    };
  }

  const sessionAdmin = session.admin;

  const admin = await Admin.findById(sessionAdmin.id);

  if (!admin || !admin.isActive) {
    await session.destroy();

    return {
      authorized: false as const,
      response: corsResponse(
        {
          success: false,
          message: 'Unauthorized',
        },
        401,
        origin
      ),
    };
  }

  return {
    authorized: true as const,
    admin: sessionAdmin,
    session,
  };
}
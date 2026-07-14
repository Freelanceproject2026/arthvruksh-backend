import Admin from '@/models/Admin';
import { getSession } from './session';
import { corsResponse } from '@/lib/cors';

export async function requireAdmin(origin?: string | null) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.admin) {
    return {
      authorized: false,
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

  const admin = await Admin.findById(session.admin.id);

  if (!admin || !admin.isActive) {
    await session.destroy();

    return {
      authorized: false,
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
    authorized: true,
    admin: session.admin,
    session,
  };
}
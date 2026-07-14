import { SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface AdminSession {
  admin?: {
    id: string;
    fullName: string;
    email: string;
    role: 'super_admin';
  };

  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'arthvruksh_admin_session',

  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};

export async function getSession() {
  return getIronSession<AdminSession>(
    await cookies(),
    sessionOptions
  );
}
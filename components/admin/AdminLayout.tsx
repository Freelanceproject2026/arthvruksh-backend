'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { LoadingSpinner } from './LoadingSpinner';
import { adminApi } from '@/lib/adminApi';

type AdminLayoutProps = {
  children: ReactNode;
};

type AdminProfile = {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadAdmin = async () => {
      try {
        const response = await adminApi<{ success: boolean; admin?: AdminProfile }>('/admin/me');
        if (!isMounted) {
          return;
        }

        if (response.admin) {
          setAdmin(response.admin);
        } else {
          setAdmin(null);
          router.replace('/admin/login');
        }
      } catch {
        if (isMounted) {
          router.replace('/admin/login');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAdmin();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await adminApi('/admin/logout', { method: 'POST' });
    } catch {
      // Ignore and redirect to login
    } finally {
      router.replace('/admin/login');
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <AdminHeader title="Admin Console" subtitle="Manage users, assessments, and system activity" adminName={admin.fullName || admin.email || 'Admin'} onLogout={handleLogout} />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

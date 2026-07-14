'use client';

import { useMemo } from 'react';
import { AdminCard } from '@/components/admin/AdminCard';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminDashboardPage() {
  const stats = useMemo(
    () => [
      { title: 'Users', value: '—', subtitle: 'Manage verified and unverified accounts' },
      { title: 'Assessments', value: '—', subtitle: 'Review and moderate submitted assessments' },
      { title: 'Risk Profiles', value: '—', subtitle: 'Track low, moderate, and high-risk users' },
    ],
    []
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-slate-950/50">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Welcome Admin</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Your admin dashboard is ready.</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Start by reviewing accounts, assessments, and activity logs. More analytics widgets will be added as the panel grows.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <AdminCard key={item.title} title={item.title} value={item.value} subtitle={item.subtitle} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

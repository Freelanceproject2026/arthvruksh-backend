'use client';

import { ReactNode } from 'react';

type AdminCardProps = {
  title: string;
  value: ReactNode;
  subtitle?: string;
  accent?: string;
};

export function AdminCard({ title, value, subtitle, accent = 'from-cyan-500 to-blue-600' }: AdminCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/40">
      <div className={`mb-4 h-2 w-20 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

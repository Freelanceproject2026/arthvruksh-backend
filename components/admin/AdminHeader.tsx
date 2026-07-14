'use client';

import { ReactNode } from 'react';

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  adminName?: string;
  onLogout?: () => void;
  children?: ReactNode;
};

export function AdminHeader({ title, subtitle, adminName, onLogout, children }: AdminHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/70 px-6 py-5 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          {children}
          {adminName ? <div className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">{adminName}</div> : null}
          {onLogout ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

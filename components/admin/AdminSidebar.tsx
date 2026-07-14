'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin/dashboard', label: 'Dashboard' },
//   { href: '/admin/users', label: 'Users' },
//   { href: '/admin/assessments', label: 'Assessments' },
//   { href: '/admin/logs', label: 'Activity Logs' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/80 p-6 lg:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">Arthvruksh</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Admin Panel</h2>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-cyan-500/15 text-cyan-300 shadow-inner'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

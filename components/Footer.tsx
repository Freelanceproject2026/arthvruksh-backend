'use client';

import { useEffect, useState } from 'react';

type FooterProps = {
  initialCount: number;
};

export function Footer({ initialCount }: FooterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/visitors', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data?.count === 'number') {
          setCount(data.count);
        }
      })
      .catch(() => {
        // Non-critical: keep showing the server-rendered count.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-auto border-t border-slate-800 px-6 py-4 text-center text-sm text-slate-400">
      <span>Visitors: </span>
      <span className="font-medium text-cyan-300">{count.toLocaleString()}</span>
    </footer>
  );
}

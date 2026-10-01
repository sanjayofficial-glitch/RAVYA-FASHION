'use client';

import { useEffect, useState } from 'react';
import { computeOpenStatus } from '@/lib/hours';

export function StoreStatus() {
  const [status, setStatus] = useState<{ isOpen: boolean; label: string; detail: string } | null>(null);

  useEffect(() => {
    setStatus(computeOpenStatus());
  }, []);

  if (!status) {
    return <span className="text-ink-2">Hours below</span>;
  }
  return (
    <span className="font-medium">
      <span className={status.isOpen ? 'text-[rgb(var(--ok))]' : 'text-ink-2'} aria-hidden>
        {status.isOpen ? '\u{1F7E2}' : '\u{1F534}'}
      </span>{' '}
      <span className="sr-only">{status.isOpen ? 'Open' : 'Closed'}</span>
      {status.label} · {status.detail}
    </span>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { brandMap } from '@/data/brands';
import { formatPrice } from '@/lib/format';
import { track } from '@/lib/track';
import type { InventoryEntry, InventoryStatus } from '@/lib/inventory';

const STATUS_META: { id: InventoryStatus; label: string }[] = [
  { id: 'in-store', label: 'In store' },
  { id: 'tried', label: 'Tried' },
  { id: 'sold', label: 'Sold' },
  { id: 'restocked', label: 'Restocked' },
];

/** Staff tablet dashboard (PRD Phase 5). Mount-gated: token comes from `?token=`. */
export function StaffDashboard() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [mounted, setMounted] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, InventoryEntry>>({});
  const [mode, setMode] = useState<'upstash' | 'memory'>('memory');
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      const json = (await res.json()) as { ok: boolean; overrides: Record<string, InventoryEntry>; mode: 'upstash' | 'memory' };
      if (json.ok) {
        setOverrides(json.overrides);
        setMode(json.mode);
      }
    } catch {
      /* dashboard stays usable with defaults */
    }
  }, []);

  useEffect(() => {
    if (mounted) void refresh();
  }, [mounted, refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => `${p.name} ${brandMap[p.brand]?.name ?? p.brand} ${p.category}`.toLowerCase().includes(q));
  }, [query]);

  const counts = useMemo(() => {
    const c: Record<InventoryStatus, number> = { 'in-store': 0, tried: 0, sold: 0, restocked: 0 };
    for (const p of products) c[overrides[p.id]?.status ?? 'in-store']! += 1;
    return c;
  }, [overrides]);

  const locked = !token;

  const setStatus = async (productId: string, status: InventoryStatus) => {
    if (locked || saving) return;
    setSaving(productId);
    setNotice(null);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-staff-token': token },
        body: JSON.stringify({ productId, status }),
      });
      const json = (await res.json()) as { ok: boolean; entry?: InventoryEntry; error?: string };
      if (!res.ok || !json.ok || !json.entry) throw new Error(json.error ?? 'save_failed');
      setOverrides((o) => ({ ...o, [productId]: json.entry! }));
      track('inventory_update', { id: productId });
    } catch {
      setNotice('Save failed — check the token and connection, then retry.');
    } finally {
      setSaving(null);
    }
  };

  if (!mounted) {
    return (
      <div aria-busy="true" className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-96 animate-pulse rounded-card bg-canvas-alt" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h1 className="text-2xl font-semibold text-ink">Store inventory</h1>
      <p className="mt-1 text-sm text-ink-2">{products.length} sample pieces · tap a status to update the rack state.</p>

      {locked ? (
        <p className="mt-4 rounded-card border border-line bg-canvas-alt p-4 text-sm text-ink-2" role="note">
          View-only mode — open this page with <span className="font-mono">?token=STAFF_TOKEN</span> to enable updates.
        </p>
      ) : null}
      {mode === 'memory' ? (
        <p className="mt-4 rounded-card border border-line bg-canvas-alt p-4 text-sm text-ink-2" role="note">
          Demo storage — changes live in server memory and reset on restart. Set Upstash env vars for persistence.
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 rounded-card border border-sale/40 bg-sale/5 p-4 text-sm text-ink" role="alert">
          {notice}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Status counts">
        {STATUS_META.map((s) => (
          <span key={s.id} className="rounded-pill border border-line px-3 py-1.5 text-[13px] text-ink-2">
            {s.label} · <strong className="text-ink">{counts[s.id]}</strong>
          </span>
        ))}
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm font-medium text-ink">
        Search rack
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, brand or category…"
          className="min-h-[48px] w-full max-w-md rounded-btn border border-line bg-canvas px-4 text-[15px] text-ink placeholder:text-ink-2/70 focus:border-accent focus:outline-none"
        />
      </label>

      <ul className="mt-4 flex flex-col gap-2">
        {filtered.map((p) => {
          const current = overrides[p.id]?.status ?? 'in-store';
          return (
            <li key={p.id} className="rounded-card border border-line p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-2">
                    {brandMap[p.brand]?.name ?? p.brand} · {p.category}
                  </p>
                  <p className="font-semibold text-ink">{p.name}</p>
                </div>
                <p className="text-sm font-semibold text-ink">{formatPrice(p.price, p.priceTo)}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Status for ${p.name}`}>
                {STATUS_META.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={locked || saving === p.id}
                    onClick={() => void setStatus(p.id, s.id)}
                    aria-pressed={current === s.id}
                    className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors disabled:opacity-50 ${
                      current === s.id ? 'border-accent bg-accent/10 font-semibold text-ink' : 'border-line text-ink-2'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {overrides[p.id] ? (
                <p className="mt-2 text-xs text-ink-2">
                  Updated {new Date(overrides[p.id]!.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-ink-2">No pieces match “{query}”.</p>
      ) : null}
    </div>
  );
}

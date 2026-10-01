'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { products, categories, tiers } from '@/data/products';
import { brands } from '@/data/brands';
import { filterProducts, tierOf } from '@/lib/filter';
import { track } from '@/lib/track';

type Key = 'cat' | 'brand' | 'tier';

/** Shared filter-group UI: used by the desktop rail and the mobile drawer. */
export function FilterGroups({ onNavigate }: { onNavigate?: () => void }) {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get('cat') ?? undefined;
  const brand = params.get('brand') ?? undefined;
  const tier = params.get('tier') ?? undefined;

  const setParam = (key: Key, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (next.get(key) === value) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    track('filter_apply', { [key]: next.get(key) ?? 'clear' });
    router.push(qs ? `/shop?${qs}` : '/shop', { scroll: false });
    onNavigate?.();
  };

  // Faceted counts: each group counts against the other two active filters.
  const countFor = (key: Key, id: string): number => {
    const others = filterProducts(products, {
      cat: key === 'cat' ? undefined : cat,
      brand: key === 'brand' ? undefined : brand,
      tier: key === 'tier' ? undefined : tier,
    });
    if (key === 'cat') return others.filter((p) => p.category === id).length;
    if (key === 'brand') return others.filter((p) => p.brand === id).length;
    return others.filter((p) => tierOf(p) === id).length;
  };

  const group = (label: string, key: Key, items: { id: string; label: string }[], active: string | undefined) => (
    <div className="mb-7">
      <h3 className="mb-1 text-[13px] font-semibold text-ink">{label}</h3>
      <ul>
        {items.map((it) => {
          const isActive = active === it.id;
          const n = countFor(key, it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setParam(key, it.id)}
                className={`flex min-h-[44px] w-full items-center justify-between text-left text-[15px] transition-colors ${
                  isActive
                    ? 'font-medium text-accent-ink underline decoration-accent decoration-2 underline-offset-[6px]'
                    : 'text-ink hover:underline decoration-line underline-offset-[6px]'
                }`}
              >
                <span>
                  {it.label}
                  {isActive ? <span className="sr-only"> (selected)</span> : null}
                </span>
                <span className="text-[13px] text-ink-2">({n})</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {group('Category', 'cat', categories, cat)}
      {group('Brand', 'brand', brands.map((b) => ({ id: b.id, label: b.name })), brand)}
      {group('Price', 'tier', tiers, tier)}
    </>
  );
}

/** Desktop left rail (md+). Mobile uses the ShopFilters drawer instead. */
export function FilterSidebar() {
  return (
    <nav aria-label="Filter products" className="hidden md:block md:sticky md:top-[7.5rem] md:self-start">
      <FilterGroups />
    </nav>
  );
}

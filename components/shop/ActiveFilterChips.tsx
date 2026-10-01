'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { categories } from '@/data/products';
import { brands } from '@/data/brands';

/** Removable summary chips for active filters, shown under the sort strip. */
export function ActiveFilterChips() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get('cat');
  const brand = params.get('brand');
  const tier = params.get('tier');

  const chips = [
    { key: 'cat', id: cat, label: categories.find((c) => c.id === cat)?.label },
    { key: 'brand', id: brand, label: brands.find((b) => b.id === brand)?.name },
    { key: 'tier', id: tier, label: tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : undefined },
  ].filter((c): c is { key: string; id: string; label: string } => Boolean(c.id && c.label));

  if (chips.length === 0) return null;

  const remove = (key: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    const qs = next.toString();
    router.push(qs ? `/shop?${qs}` : '/shop', { scroll: false });
  };

  return (
    <div className="enter-rise mt-3 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => remove(chip.key)}
          aria-label={`Remove ${chip.label} filter`}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-pill bg-ink px-3.5 py-1.5 text-[13px] font-medium text-white active:scale-[0.97]"
        >
          {chip.label}
          <span aria-hidden className="text-white/60">
            ×
          </span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.push('/shop', { scroll: false })}
        className="min-h-[36px] px-2 text-[13px] font-medium text-accent-ink underline underline-offset-4"
      >
        Clear all
      </button>
    </div>
  );
}

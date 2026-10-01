'use client';

import { useSearchParams, useRouter } from 'next/navigation';

const OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'new', label: 'New first' },
];

export function ShopSort() {
  const params = useSearchParams();
  const router = useRouter();
  const sort = params.get('sort') ?? '';

  return (
    <label className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-ink">
      <span className="sr-only">Sort by</span>
      <span aria-hidden className="text-ink-2">
        Sort
      </span>
      <select
        value={sort}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (!e.target.value) next.delete('sort');
          else next.set('sort', e.target.value);
          const qs = next.toString();
          router.push(qs ? `/shop?${qs}` : '/shop', { scroll: false });
        }}
        className="cursor-pointer appearance-none rounded-none border-none bg-transparent py-2 pr-5 font-medium text-ink underline decoration-line underline-offset-[6px] outline-offset-4 hover:decoration-ink"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111111' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 2px center',
        }}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

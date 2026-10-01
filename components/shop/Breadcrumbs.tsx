'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/data/products';
import { brandMap } from '@/data/brands';

function labelFor(kind: string, value?: string): string | null {
  if (!value) return null;
  if (kind === 'cat') return categories.find((c) => c.id === value)?.label ?? value;
  if (kind === 'brand') return brandMap[value as keyof typeof brandMap]?.name ?? value;
  if (kind === 'tier') return value.charAt(0).toUpperCase() + value.slice(1);
  return value;
}

export function Breadcrumbs() {
  const params = useSearchParams();
  const cat = params.get('cat') ?? undefined;
  const brand = params.get('brand') ?? undefined;
  const tier = params.get('tier') ?? undefined;

  const crumbs = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: null, label: labelFor('cat', cat) },
    { href: null, label: labelFor('brand', brand) },
    { href: null, label: labelFor('tier', tier) },
  ].filter((c): c is { href: string | null; label: string } => c.label !== null);

  if (crumbs.length <= 2) return <div className="h-5" aria-hidden />;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-[13px] text-ink-2">
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 ? <span aria-hidden> / </span> : null}
          {c.href && i < crumbs.length - 1 ? (
            <Link href={c.href} className="hover:text-ink hover:underline">{c.label}</Link>
          ) : (
            <span aria-current="page" className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

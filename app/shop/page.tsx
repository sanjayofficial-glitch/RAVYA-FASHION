import { Suspense } from 'react';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { ShopFilters } from '@/components/shop/ShopFilters';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { QuickView } from '@/components/product/QuickView';
import { ScrollToTop } from '@/components/shop/ScrollToTop';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { ShopSort } from '@/components/shop/ShopSort';
import { ActiveFilterChips } from '@/components/shop/ActiveFilterChips';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateBreadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'In-Store Catalog',
  path: '/shop',
  description:
    'On the racks at Ravya Fashion, Rourkela: casual, formal, denim and activewear from Ramraj, Killer, Sparky, Ignite, Jockey and Unibro. Filter by brand, then enquire on WhatsApp.',
});

/**
 * The unfiltered shell is statically generated; filter state lives in the URL
 * and is applied client-side against the bundled catalog (plan §3 C1).
 */
export default function ShopPage() {
  return (
    <>
      <QuickView />
      <ScrollToTop />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop' },
        ])}
      />
      <div className="mx-auto max-w-6xl px-4 pt-6 md:px-8">
        <Suspense fallback={<div className="h-5" aria-hidden />}>
          <Breadcrumbs />
        </Suspense>
        <h1 className="display-section text-ink">The Catalog</h1>
        <p className="mb-3 mt-1 text-sm text-ink-2">
          Every piece below is on our racks today. Tap a card to enquire on WhatsApp for pricing and availability.
        </p>
        <p className="mb-4 inline-block rounded-pill bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-ink">
          {products.length} pieces ready for trial today
        </p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-8">
        <Suspense fallback={<div className="h-11" aria-hidden />}>
          <div className="flex items-center justify-between gap-3">
            <ShopFilters />
            <ShopSort />
          </div>
          <ActiveFilterChips />
        </Suspense>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-12 md:px-8">
        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-8">
          <Suspense fallback={<div className="hidden" aria-hidden />}>
            <FilterSidebar />
          </Suspense>
          <div>
            <Suspense fallback={<GridSkeleton />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-lg bg-white p-2.5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
          <div className="skeleton aspect-[4/5] w-full rounded-md" />
          <div className="flex flex-col gap-1.5 px-1 pt-2">
            <div className="skeleton h-2.5 w-1/3 rounded-pill" />
            <div className="skeleton h-4 w-4/5 rounded-pill" />
            <div className="skeleton h-3 w-2/3 rounded-pill" />
          </div>
          <div className="mt-2 flex flex-col gap-2 px-1 pb-1">
            <div className="skeleton h-11 rounded-pill" />
            <div className="skeleton h-11 rounded-pill" />
          </div>
        </div>
      ))}
    </div>
  );
}

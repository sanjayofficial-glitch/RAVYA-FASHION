'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterGroups } from './FilterSidebar';
import { FunnelIcon } from '@/components/ui/icons';
import { activeFilterCount } from '@/lib/filter';

/** Mobile filter trigger + off-canvas drawer (shared sidebar UI inside). */
export function ShopFilters() {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const cat = params.get('cat') ?? undefined;
  const brand = params.get('brand') ?? undefined;
  const tier = params.get('tier') ?? undefined;
  const count = activeFilterCount({ cat, brand, tier });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-line px-4 text-sm font-medium text-ink md:hidden"
        aria-expanded={open}
      >
        <FunnelIcon size={16} />
        Filters
        {count > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-pill bg-ink px-1.5 text-[11px] font-semibold text-white">
            {count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button aria-label="Close filters" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="sheet-in absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-canvas shadow-lift">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="text-lg font-semibold text-ink">Filters</p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-pill bg-canvas-alt text-ink"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              <FilterGroups onNavigate={() => setOpen(false)} />
            </div>
            {count > 0 ? (
              <div className="border-t border-line p-4 pb-safe">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    window.location.assign('/shop');
                  }
                  }
                  className="btn btn-secondary w-full"
                >
                  Clear all ({count})
                </button>
              </div>
            ) : null}
          </div>
      </div>
      ) : null}
    </>
  );
}

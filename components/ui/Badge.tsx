import { site } from '@/config/site';

/** IN-STORE badge. Honesty gate: sample catalogs read "AVAILABLE IN STORE*". */
export function InStoreBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-2">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[rgb(var(--ok))]" aria-hidden />
      {site.sampleCatalog ? 'Available in store*' : 'In-store: Rourkela'}
    </span>
  );
}

export function NewBadge() {
  return (
    <span className="rounded-pill bg-ink px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white">
      New
    </span>
  );
}

const ITEMS = [
  'Gen-Z to Millennial Styles',
  'Everyday Value to Premium Curation',
  '100% In-Store Verified',
  'Authorized: Ramraj',
  'Killer',
  'Sportiq',
  'Ignite',
  'Jockey',
  'Unibro',
];

export function Ticker() {
  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
          {item}
          <span className="ml-5 inline-block h-1.5 w-1.5 rounded-full bg-ochre-soft" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="mx-3 mt-4 md:mx-6" role="marquee" aria-label="Store highlights">
      <div className="ticker overflow-hidden rounded-pill bg-ink">
        <div className="ticker-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

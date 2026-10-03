export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8" role="status" aria-label="Loading page">
      <div className="skeleton h-4 w-28 rounded-pill" />
      <div className="skeleton mt-4 h-10 w-64 rounded-lg" />
      <div className="skeleton mt-3 h-4 w-80 max-w-full rounded-md" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[16/10] w-full rounded-lg" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

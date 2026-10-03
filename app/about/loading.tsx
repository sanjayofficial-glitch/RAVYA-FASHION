export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8" role="status" aria-label="Loading our story">
      <div className="skeleton h-4 w-56 rounded-md" />
      <div className="skeleton mt-4 h-10 w-60 rounded-lg" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="skeleton aspect-[4/3] w-full rounded-lg" />
        <div className="skeleton aspect-[4/3] w-full rounded-lg" />
      </div>
      <div className="mt-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-24 w-full rounded-lg" />
        ))}
      </div>
      <span className="sr-only">Loading our story…</span>
    </div>
  );
}

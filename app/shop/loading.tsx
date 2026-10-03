export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 md:px-8" role="status" aria-label="Loading catalog">
      <div className="skeleton h-5 w-40 rounded-md" />
      <div className="skeleton mt-4 h-9 w-56 rounded-lg" />
      <div className="skeleton mt-3 h-4 w-96 max-w-full rounded-md" />
      <div className="skeleton mt-4 h-6 w-52 rounded-pill" />
      <div className="mx-auto mt-4 max-w-6xl px-4 py-4 md:px-8">
        <div className="skeleton h-11 w-full rounded-lg" />
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[3/4] w-full rounded-lg" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading catalog…</span>
    </div>
  );
}

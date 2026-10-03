export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8" role="status" aria-label="Loading visit details">
      <div className="skeleton h-4 w-52 rounded-md" />
      <div className="skeleton mt-4 h-10 w-64 rounded-lg" />
      <div className="skeleton mt-6 aspect-[21/9] w-full rounded-xl" />
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-32 rounded-pill" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="skeleton h-48 w-full rounded-lg" />
        <div className="skeleton h-48 w-full rounded-lg" />
      </div>
      <span className="sr-only">Loading visit details…</span>
    </div>
  );
}

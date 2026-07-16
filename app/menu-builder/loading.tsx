// Shown while the wizard layout fetches the catalog from Sanity.
// Mirrors the builder's dark canvas + a white card with shimmer rows.
export default function MenuBuilderLoading() {
  return (
    <div style={{ backgroundColor: "#0f2f3b" }} className="min-h-screen w-full px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-[#d4a574]" />
        </div>
        <div className="rounded-sm bg-white p-8 md:p-10">
          <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-gray-100" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[130px] animate-pulse rounded bg-gray-200" />
            ))}
          </div>
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

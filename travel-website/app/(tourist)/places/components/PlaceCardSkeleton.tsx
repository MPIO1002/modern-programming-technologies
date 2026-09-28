export default function PlaceCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* IMAGE */}
      <div className="aspect-[16/10] animate-pulse bg-slate-200" />

      {/* CONTENT */}
      <div className="p-4">
        {/* TITLE */}
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200" />

        {/* DESCRIPTION */}
        <div className="mt-3 space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-100" />
        </div>

        {/* OPEN TIME */}
        <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-slate-100" />

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="h-3.5 w-20 animate-pulse rounded bg-slate-100" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </article>
  );
}
export default function PlaceCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#3282B8]/30 bg-white dark:bg-[#0F4C75]/40 shadow-sm flex flex-col h-full relative">
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-[#1B262C] animate-pulse">
        {/* CATEGORY */}
        <div className="absolute left-3 top-3 h-5 w-16 rounded-full bg-slate-300 dark:bg-[#3282B8]/40" />

        {/* PRICE */}
        <div className="absolute right-3 top-3 h-5 w-16 rounded-full bg-slate-300 dark:bg-[#3282B8]/40" />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        {/* TITLE */}
        <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />

        {/* DESCRIPTION */}
        <div className="mt-1.5 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
        </div>

        {/* OPEN TIME */}
        <div className="mt-3 mb-4 h-3.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />

        {/* ACTION BUTTONS */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-[#3282B8]/20">
          {/* DETAIL BUTTON */}
          <div className="h-10 w-full animate-pulse rounded-xl bg-indigo-100 dark:bg-[#0F4C75]" />

          {/* ADD TO ITINERARY BUTTON */}
          <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-[#3282B8]/50" />
        </div>
      </div>
    </article>
  );
}
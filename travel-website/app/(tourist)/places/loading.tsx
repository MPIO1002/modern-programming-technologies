import PlaceGridSkeleton from "./components/PlaceGridSkeleton";

export default function PlacesLoading() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-[100px] pt-[72px] dark:bg-[#1B262C] max-[600px]:pb-[70px] max-[600px]:pt-12">
      <section className="w-full px-6 max-[600px]:px-4">
        <div className="mx-auto w-full max-w-[1080px]">
          <div className="mb-[18px] h-3 w-36 animate-pulse rounded bg-indigo-100" />
          <div className="h-16 w-3/4 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="mt-6 h-6 max-w-[620px] animate-pulse rounded bg-slate-100 dark:bg-slate-700/70" />
          <div className="mt-8 h-12 max-w-[620px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700/70" />
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1080px] px-4 sm:px-6 lg:px-0 max-[600px]:mt-14">
        <div className="mb-6 h-7 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <PlaceGridSkeleton />
      </section>
    </main>
  );
}

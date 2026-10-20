import { Suspense } from "react";
import PlaceExplorer from "@/app/(tourist)/places/components/PlaceExplorer";
import PlaceGridSkeleton from "@/app/(tourist)/places/components/PlaceGridSkeleton";
import { getBenchmarkPlaces } from "@/services/places-benchmark.service";

export const dynamic = "force-dynamic";

async function PlacesContent() {
  const places = await getBenchmarkPlaces();
  return <PlaceExplorer places={places} />;
}

export default function StreamingBenchmarkPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-[100px] pt-[72px] dark:bg-[#1B262C]">
      <section className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
        <p className="mb-3 text-xs font-bold tracking-widest text-indigo-500">
          BENCHMARK — NEXT.JS STREAMING
        </p>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Khám phá địa điểm
        </h1>

        <p className="mt-3 text-slate-500">
          Phiên bản thử nghiệm: hiển thị skeleton trong lúc chờ dữ liệu.
        </p>

        <Suspense
          fallback={<PlaceGridSkeleton />}
        >
          <PlacesContent />
        </Suspense>
      </section>
    </main>
  );
}

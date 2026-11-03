import { Suspense } from "react";
import PlaceExplorer from "@/app/(tourist)/places/components/PlaceExplorer";
import PlaceGridSkeleton from "@/app/(tourist)/places/components/PlaceGridSkeleton";
import { getBenchmarkPlaces } from "@/services/places-benchmark.service";

export const dynamic = "force-dynamic";

async function StreamingPlaces() {
  const places = await loadStreamingPlaces();
  return places ? (
    <PlaceExplorer places={places} />
  ) : (
    <p className="text-red-600">Không thể tải dữ liệu benchmark.</p>
  );
}

async function loadStreamingPlaces() {
  try {
    return await getBenchmarkPlaces();
  } catch (error) {
    console.error("Streaming benchmark error:", error);
    return null;
  }
}

export default function StreamingBenchmarkPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 pb-20 pt-24 text-slate-900">
      <section className="mx-auto w-full max-w-[1080px]">
        <p className="mb-3 text-xs font-bold tracking-[0.12em] text-indigo-500">
          BENCHMARK · STREAMING
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          Places Streaming
        </h1>
        <p className="mb-10 text-slate-500">
          Khung trang được gửi trước, danh sách được stream sau khi dữ liệu
          hoàn tất.
        </p>
        <Suspense fallback={<PlaceGridSkeleton />}>
          <StreamingPlaces />
        </Suspense>
      </section>
    </main>
  );
}

import PlaceExplorer from "@/app/(tourist)/places/components/PlaceExplorer";
import { getBenchmarkPlaces } from "@/services/places-benchmark.service";

export const dynamic = "force-dynamic";

async function loadBlockingPlaces() {
  try {
    return await getBenchmarkPlaces();
  } catch (error) {
    console.error("Blocking benchmark error:", error);
    return null;
  }
}

export default async function BlockingBenchmarkPage() {
  const places = await loadBlockingPlaces();

  if (!places) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 pb-20 pt-24 text-slate-900">
        <p className="mx-auto max-w-[1080px] text-red-600">
          Không thể tải dữ liệu benchmark.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 pb-20 pt-24 text-slate-900">
      <section className="mx-auto w-full max-w-[1080px]">
        <p className="mb-3 text-xs font-bold tracking-[0.12em] text-indigo-500">
          BENCHMARK · BLOCKING
        </p>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          Places Blocking
        </h1>
        <p className="mb-10 text-slate-500">
          Dữ liệu được tải xong trước khi danh sách được render.
        </p>
        <PlaceExplorer places={places} />
      </section>
    </main>
  );
}

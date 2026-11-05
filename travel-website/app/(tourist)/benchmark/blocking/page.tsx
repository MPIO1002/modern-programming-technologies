import PlaceExplorer from "@/app/(tourist)/places/components/PlaceExplorer";
import { getBenchmarkPlaces } from "@/services/places-benchmark.service";

export const dynamic = "force-dynamic";

export default async function BlockingBenchmarkPage() {
  const places = await getBenchmarkPlaces();

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-[100px] pt-[72px] dark:bg-[#1B262C]">
      <section className="mx-auto w-full max-w-[1080px] px-4 sm:px-6">
        <p className="mb-3 text-xs font-bold tracking-widest text-indigo-500">
          BENCHMARK — BLOCKING SSR
        </p>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Khám phá địa điểm
        </h1>

        <p className="mt-3 text-slate-500">
          Phiên bản đối chứng: chờ dữ liệu trước khi render danh sách.
        </p>

        <PlaceExplorer places={places} />
      </section>
    </main>
  );
}

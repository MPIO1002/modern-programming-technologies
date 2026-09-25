import Link from 'next/link';
import Image from 'next/image';
import { Place } from '@/types/place';
import { FEATURED_PLACES } from '@/lib/mockData';

async function getFeaturedPlaces(): Promise<Place[]> {
  // Demo fetch || fallback dữ liệu tĩnh
  return FEATURED_PLACES;
}

export default async function FeaturedPlaces() {
  const places = await getFeaturedPlaces();

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-3 border-b border-[#0F4C75] pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#BBE1FA]">
            Điểm Đến Nổi Bật
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Các tọa độ du lịch được quan tâm nhiều nhất tại TP. Hồ Chí Minh
          </p>
        </div>
        <Link
          href="/places"
          className="text-sm font-semibold text-[#3282B8] hover:text-[#BBE1FA] transition"
        >
          Xem tất cả địa điểm &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {places.map((place) => (
          <div
            key={place.id}
            className="group bg-[#0F4C75]/40 rounded-2xl overflow-hidden border border-[#3282B8]/30 hover:border-[#3282B8] transition-all duration-300 flex flex-col"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={place.image}
                alt={place.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 bg-[#1B262C]/90 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-300/30">
                ★ {place.rating}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#3282B8] font-medium">
                  {place.ward}, {place.district}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-[#BBE1FA] transition">
                  {place.name}
                </h3>
                <p className="text-slate-300 text-xs mt-2 line-clamp-2">
                  {place.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#3282B8]/20 flex justify-between items-center">
                <Link
                  href={`/places/${place.slug}`}
                  className="text-xs font-semibold text-[#BBE1FA] bg-[#0F4C75] hover:bg-[#3282B8] px-4 py-2 rounded-lg transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
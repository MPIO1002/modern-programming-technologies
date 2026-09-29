import Link from 'next/link';
import { Place } from '@/types/place';
import PlaceCard from '@/app/(tourist)/places/components/PlaceCard';

const API_BASE_URL = process.env.MOCKAPI_PLACES_URL;

async function getFeaturedPlaces(): Promise<Place[]> {
  if (!API_BASE_URL) {
    console.error('Chưa cấu hình biến môi trường MOCKAPI_PLACES_URL');
    return [];
  }

  try {
    const res = await fetch(API_BASE_URL, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Không thể tải dữ liệu từ MockAPI');
    }

    return await res.json();
  } catch (error) {
    console.error('Lỗi khi fetch địa điểm:', error);
    return [];
  }
}

export default async function FeaturedPlaces() {
  const places = await getFeaturedPlaces();

  return (
    <section className="py-16 px-4 bg-indigo-50/40 dark:bg-[#1B262C]/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-3 border-b border-indigo-200 dark:border-[#0F4C75] pb-4 transition-colors">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#BBE1FA] transition-colors">
              Điểm Đến Nổi Bật
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
              Các tọa độ du lịch được quan tâm nhiều nhất tại ba miền.
            </p>
          </div>
          <Link
            href="/places"
            className="text-sm font-semibold text-indigo-600 dark:text-[#3282B8] hover:text-indigo-800 dark:hover:text-[#BBE1FA] transition"
          >
            Xem tất cả địa điểm &rarr;
          </Link>
        </div>

        {places.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            Chưa có địa điểm nào được tải từ MockAPI. Vui lòng kiểm tra lại kết nối.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {places.slice(0, 4).map((place) => (
              <PlaceCard 
                key={place.id}
                place={{
                  id: place.id,
                  slug: place.slug || place.id.toString(),
                  name: place.name,
                  description: place.description,
                  category: place.category,
                  price: place.price,
                  thumbnail: place.thumbnail,
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
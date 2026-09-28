import Link from 'next/link';
import { Itinerary } from '@/types/place';

const API_BASE_URL = process.env.MOCKAPI_URL;

async function getSampleItineraries(): Promise<Itinerary[]> {
  if (!API_BASE_URL) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/itineraries`, {
      cache: 'no-store', 
    });

    if (!res.ok) throw new Error('Lỗi fetch itineraries');
    return await res.json();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu lộ trình:', error);
    return [];
  }
}

export default async function SampleItineraries() {
  const itineraries = await getSampleItineraries();

  return (
    <section className="py-16 px-4 bg-slate-50/50 dark:bg-[#1B262C]/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#BBE1FA] transition-colors">
            Gợi Ý Lộ Trình Tham Quan
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 transition-colors">
            Các cung đường tối ưu sẵn sàng đưa vào công cụ điều hướng bản đồ Vietmap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {itineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0F4C75]/60 dark:to-[#1B262C] border border-slate-200 dark:border-[#3282B8]/40 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors duration-300 group"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-[#BBE1FA]">
                    {itinerary.title}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-indigo-50 dark:bg-[#3282B8]/30 text-indigo-700 dark:text-[#BBE1FA] border border-indigo-100 dark:border-[#3282B8]/50 rounded-full whitespace-nowrap transition-colors">
                    {itinerary.stopsCount} điểm dừng
                  </span>
                </div>

                <div className="flex gap-4 text-xs text-slate-600 dark:text-[#BBE1FA]/90 mt-3 font-medium transition-colors">
                  <span>Thời gian: {itinerary.duration}</span>
                  <span>Quãng đường: {itinerary.distance}</span>
                </div>

                <p className="text-slate-500 dark:text-slate-300 text-sm mt-3 transition-colors">
                  {itinerary.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {itinerary.highlights?.map((spot, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 dark:bg-[#1B262C] text-slate-600 dark:text-slate-300 px-3 py-1 rounded-md border border-slate-200 dark:border-[#0F4C75] transition-colors"
                    >
                      • {spot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#3282B8]/30 transition-colors">
                <Link
                  href={`/map`}
                  className="w-full inline-block text-center py-3 bg-[#0F4C75] hover:bg-[#3282B8] text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
                >
                  Mở Trên Bản Đồ Vietmap
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
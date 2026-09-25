import Link from 'next/link';
import { SAMPLE_ITINERARIES } from '@/lib/mockData';

export default function SampleItineraries() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#BBE1FA]">
          Gợi Ý Lộ Trình Tham Quan
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Các cung đường tối ưu sẵn sàng đưa vào công cụ điều hướng bản đồ Vietmap
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SAMPLE_ITINERARIES.map((itinerary) => (
          <div
            key={itinerary.id}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#0F4C75]/60 to-[#1B262C] border border-[#3282B8]/40 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-white">
                  {itinerary.title}
                </h3>
                <span className="text-xs px-3 py-1 bg-[#3282B8]/30 text-[#BBE1FA] border border-[#3282B8]/50 rounded-full whitespace-nowrap">
                  {itinerary.stopsCount} điểm dừng
                </span>
              </div>

              <div className="flex gap-4 text-xs text-[#BBE1FA]/90 mt-3 font-medium">
                <span>⏱ Thời gian: {itinerary.duration}</span>
                <span>📍 Quãng đường: {itinerary.distance}</span>
              </div>

              <p className="text-slate-300 text-sm mt-3">
                {itinerary.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {itinerary.highlights.map((spot, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#1B262C] text-slate-300 px-3 py-1 rounded-md border border-[#0F4C75]"
                  >
                    • {spot}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3282B8]/30">
              <Link
                href="/trip-planner"
                className="w-full inline-block text-center py-3 bg-[#3282B8] hover:bg-[#0F4C75] text-white font-semibold rounded-xl text-sm transition shadow-md"
              >
                Mở Trên Bản Đồ Vietmap
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
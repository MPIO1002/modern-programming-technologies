import Image from 'next/image';
import QuickSearchBar from './QuickSearchBar';

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[580px] flex items-center justify-center text-center px-4 overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1920&q=80"
        alt="Du lịch thành phố"
        fill
        priority
        sizes="100vw"
        className="object-cover -z-20 brightness-[0.38]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B262C]/80 via-[#1B262C]/50 to-[#1B262C] -z-10" />

      <div className="max-w-4xl mx-auto space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#0F4C75] text-[#BBE1FA] border border-[#3282B8]/50">
          Tích hợp Vietmap API
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#BBE1FA] tracking-tight leading-tight">
          Hành Trình Du Lịch Thông Minh <br />
          <span className="text-white">Tối Ưu Tuyến Đường Đi</span>
        </h1>

        <p className="text-[#BBE1FA]/80 text-base sm:text-lg max-w-2xl mx-auto">
          Khám phá di tích lịch sử, danh lam thắng cảnh và sắp xếp lịch trình di chuyển khoa học nhất.
        </p>

        <div className="pt-3">
          <QuickSearchBar />
        </div>
      </div>
    </section>
  );
}
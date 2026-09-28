import Image from 'next/image';
import QuickSearchBar from './QuickSearchBar';

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[580px] flex items-center justify-center text-center px-4 overflow-hidden transition-colors duration-300">
      {/* Lớp nền ảnh */}
      <div className="absolute inset-0 z-0 bg-slate-50">
        <Image
          src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1920&q=80"
          alt="Du lịch thành phố"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        {/* Lớp phủ mờ */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-slate-50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-100 text-indigo-700 dark:bg-[#0F4C75] dark:text-[#BBE1FA] border border-indigo-200 dark:border-[#3282B8]/50 transition-colors">
          Tích hợp Vietmap API
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#BBE1FA] tracking-tight leading-tight transition-colors">
          Hành Trình Du Lịch Thông Minh <br />
          <span className="text-indigo-600 dark:text-white transition-colors">Tối Ưu Tuyến Đường Đi</span>
        </h1>

        <p className="text-slate-600 dark:text-[#BBE1FA]/80 text-base sm:text-lg max-w-4xl mx-auto transition-colors">
          Khám phá di tích lịch sử, danh lam thắng cảnh và sắp xếp lịch trình di chuyển khoa học nhất.
        </p>

        <div className="pt-3">
          <QuickSearchBar />
        </div>
      </div>
    </section>
  );
}
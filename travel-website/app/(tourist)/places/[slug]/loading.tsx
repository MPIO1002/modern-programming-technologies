export default function PlaceDetailLoading() {
  return (
    <main className="w-full min-h-screen bg-[#f8fafc] dark:bg-[#1B262C] text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
        
        {/* 1. HERO BANNER SKELETON */}
        <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm bg-slate-200 dark:bg-slate-700/60 flex items-end p-6 md:p-10">
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-300/70 dark:from-slate-800/80 to-transparent pointer-events-none" />
        </div>

        {/* 2. BỐ CỤC 2 CỘT CHÍNH */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI: NỘI DUNG GIỚI THIỆU SKELETON */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4">
              {/* Nút quay lại */}
              <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded-md" />

              {/* Tiêu đề & Nút Tìm đường đi */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="h-10 md:h-12 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-12 w-36 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
              </div>
            </div>

            {/* Dải phân cách */}
            <div className="h-[2px] w-full bg-slate-200 dark:bg-slate-700/60" />

            {/* Khối nội dung Giới thiệu & Trải nghiệm */}
            <div className="pt-6 mr-15 space-y-6">
              {/* Mục Giới thiệu */}
              <div className="space-y-3">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700/70 rounded" />
                <div className="h-4 w-11/12 bg-slate-200 dark:bg-slate-700/70 rounded" />
                <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-700/70 rounded" />
              </div>

              {/* Mục Trải nghiệm */}
              <div className="space-y-3 pt-4">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700/70 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700/70 rounded" />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THẺ THÔNG TIN CHI TIẾT SKELETON */}
          <div className="lg:col-span-1 sticky top-24 bg-white dark:bg-[#0F4C75]/40 border border-slate-200 dark:border-[#3282B8]/30 rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300">
            {/* Header thông tin chi tiết */}
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded" />
            </div>

            {/* Nút Thêm vào lịch trình skeleton */}
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl" />

            {/* Lưới 4 InfoCards */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#3282B8]/30">
              {/* Tọa độ */}
              <div className="space-y-1.5">
                <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>

              {/* Loại hình */}
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>

              {/* Giờ mở cửa */}
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>

              {/* Chi phí */}
              <div className="space-y-1.5">
                <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700/50 rounded" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function PlaceNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-2 text-7xl font-bold text-[#3282B8] sm:text-8xl">
        404
      </h1>
      <h2 className="mb-3 text-2xl font-semibold text-[#3282B8] sm:text-3xl">
        Không tìm thấy địa điểm
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Không tìm thấy thông tin điểm đến. Hãy thử tìm kiếm một tọa độ khác trên bản đồ.
      </p>
      <Link
        href="/places"
        className="inline-flex items-center rounded-lg bg-[#3282B8] px-6 py-3 font-medium text-white transition-colors hover:bg-[#2A6B99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Xem danh sách địa điểm
      </Link>
    </div>
  );
}
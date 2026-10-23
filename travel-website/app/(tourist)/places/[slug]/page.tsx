import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import InfoCard from '@/components/InfoCard';
import AddButton from '@/components/AddButton';
import type { Place } from '@/types/place';

const MOCK_API_URL =
  process.env.MOCKAPI_PLACES_URL;

// HÀM FETCH API
async function getPlaceData(slug: string): Promise<Place | null> {
  try {
    const res = await fetch(`${MOCK_API_URL}?slug=${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data: Place[] = await res.json();
    const exactData = data.find((item) => item.slug === slug);

    return exactData || null;
  } catch (error) {
    return null;
  }
}

// GENERATE METADATA (TỐI ƯU SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (!place) {
    return {
      title: 'Không tìm thấy địa điểm | Travel',
      description: 'Địa điểm du lịch không tồn tại hoặc đã bị xóa.',
    };
  }

  const imageUrl = place.thumbnail || place.image || '';

  return {
    title: `${place.name} | Travel`,
    description: place.description,
    openGraph: {
      title: `${place.name} | Travel`,
      description: place.description,
      images: imageUrl ? [{ url: imageUrl, alt: place.name }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.name} | Travel`,
      description: place.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

// GIAO DIỆN
export default async function PlaceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (!place) {
    notFound();
  }

  const imageUrl = place.thumbnail || place.image;

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-white dark:bg-[#1B262C] text-gray-900 dark:text-white rounded-2xl transition-colors">
      {/* 1. ẢNH BÌA (HERO BANNER) SỬ DỤNG NEXT/IMAGE TỐI ƯU HIỆU NĂNG VÀ SEO */}
      <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 flex items-end p-6 md:p-10">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={place.name}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1152px"
            className="object-cover"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-indigo-900/30 to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. BỐ CỤC 2 CỘT CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CỘT TRÁI: NỘI DUNG GIỚI THIỆU (Để nội dung dài thoải mái) */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            {place.name}
          </h1>

          <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-indigo-300 to-transparent" />

          <div className="pt-6 md:pt-10 space-y-6">
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                — Giới thiệu
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {place.description}
              </p>
            </div>

            {place.experience && (
              <div>
                <h2 className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                  — Trải nghiệm
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {place.experience}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: THẺ THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-1 sticky top-6 bg-gradient-to-b from-indigo-50 to-white dark:from-[#0F4C75]/30 dark:to-[#1B262C] border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Thông tin chi tiết
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tổng quan chi tiết về tọa độ và thời gian hoạt động.
            </p>
          </div>

          <AddButton placeId={place.id} />

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-indigo-100 dark:border-indigo-900/50">
            <InfoCard title="Tọa độ" value={`${place.lat}, ${place.lng}`} />
            <InfoCard title="Loại hình" value={place.category} />
            <InfoCard title="Giờ mở cửa" value={place.openTime || 'Đang cập nhật'} />
            <InfoCard
              title="Chi phí"
              value={place.price === 'free' ? 'Miễn phí' : place.price || 'Miễn phí'}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
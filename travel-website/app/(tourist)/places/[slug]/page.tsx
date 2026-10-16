import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import InfoCard from '@/components/InfoCard';
import AddButton from '@/components/AddButton';

// OBJECT
type Place = {
  id: number;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  image: string;
  lat: number;
  lng: number;
  category: string;
  openTime: string;
  price: string;
  experience: string;
};

const MOCK_API_URL =
  process.env.MOCKAPI_PLACES_URL ||
  (process.env.NEXT_PUBLIC_MOCKAPI_URL
    ? `${process.env.NEXT_PUBLIC_MOCKAPI_URL}/places`
    : '');

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

// GENERATE METADATA 
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (!place) {
    return { title: 'Không tìm thấy địa điểm' };
  }
  const imageUrl = place.thumbnail || place.image || '';

  return {
    title: `${place.name} | Travel`,
    description: place.description,
    openGraph: {
      title: place.name,
      description: place.description,
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: place.name,
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
    <main className="w-full min-h-screen bg-[#f8fafc] dark:bg-[#1B262C] text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* NÚT QUAY LẠI & TIÊU ĐỀ TRANG */}
        <div className="space-y-3">
          <Link
            href="/places"
            className="text-[#0F4C75] dark:text-[#BBE1FA] font-semibold hover:text-[#3282B8] dark:hover:text-white transition inline-flex items-center gap-1 text-sm"
          >
            &larr; Quay lại danh sách
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
              {place.name}
            </h1>
            <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0F4C75]/10 text-[#0F4C75] dark:bg-[#3282B8]/30 dark:text-[#BBE1FA] border border-[#3282B8]/30">
              {place.category || 'Địa điểm tham quan'}
            </span>
          </div>
          <div className="h-[2px] w-full bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-transparent dark:from-[#3282B8] dark:via-[#BBE1FA]" />
        </div>

        <div className="relative w-full h-[360px] md:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-[#3282B8]/30 bg-slate-900/10 flex items-center justify-center">
          {/* Lớp nền mờ */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover blur-2xl opacity-40 dark:opacity-30 scale-110 pointer-events-none"
            />
          )}

          {/* Ảnh chính nguyên vẹn không bị cắt */}
          {imageUrl && (
            <div className="relative z-10 w-full h-full p-2 sm:p-4">
              <Image
                src={imageUrl}
                alt={place.name}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-contain drop-shadow-md rounded-xl"
              />
            </div>
          )}
        </div>

        {/* 2. BỐ CỤC 2 CỘT CHÍNH */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CỘT TRÁI: NỘI DUNG GIỚI THIỆU & TRẢI NGHIỆM */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#0F4C75]/20 border border-slate-200 dark:border-[#3282B8]/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold tracking-wider text-[#0F4C75] dark:text-[#BBE1FA] uppercase mb-2">
                  — Giới thiệu
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {place.description}
                </p>
              </div>

              {place.experience && (
                <div className="pt-4 border-t border-slate-100 dark:border-[#3282B8]/20">
                  <h3 className="text-sm font-bold tracking-wider text-[#0F4C75] dark:text-[#BBE1FA] uppercase mb-2">
                    — Trải nghiệm
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                    {place.experience}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: THẺ THÔNG TIN CHI TIẾT */}
          <div className="lg:col-span-1 sticky top-24 bg-white dark:bg-[#0F4C75]/40 border border-slate-200 dark:border-[#3282B8]/30 rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">
                Thông tin chi tiết
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                Tổng quan chi tiết về tọa độ và thời gian hoạt động.
              </p>
            </div>

            <AddButton placeId={place.id} />

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#3282B8]/30 transition-colors">
              <InfoCard title="Tọa độ" value={`${place.lat}, ${place.lng}`} />
              <InfoCard title="Loại hình" value={place.category} />
              <InfoCard title="Giờ mở cửa" value={place.openTime} />
              <InfoCard
                title="Chi phí"
                value={place.price === "free" ? "Miễn phí" : place.price}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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
  lat: number;
  lng: number;
  category: string;
  openTime: string;
  price: string;
  experience: string;
};

const MOCK_API_URL = 'https://6ab0c6fc9751d2b03e6c6e16.mockapi.io/TravelWebsite/places';

// HÀM FETCH API
async function getPlaceData(slug: string): Promise<Place | null> {
  try {
    const res = await fetch(`${MOCK_API_URL}?slug=${slug}`, { 
    next: { revalidate: 60 }
    });
    
    if (!res.ok) return null;
    
    const data: Place[] = await res.json();
	const exactData = data.find(item => item.slug === slug);

    return exactData || null;
  } catch (error) {
      return null;
  }
}

// GENERATE METADATA
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (!place) {
    return { title: 'Không tìm thấy địa điểm' };
  }

  return {
    title: `${place.name} | Travel`,
    description: place.description,
    openGraph: {
    title: place.name,
    description: place.description,
    images: [place.thumbnail], 
    },
  };
}

// GIAO DIỆN
export default async function PlaceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = await getPlaceData(slug);

  if (!place) {
    notFound(); 
  }

  return (
    <main className="w-full min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* 1. ẢNH BÌA (HERO BANNER) CÓ TIÊU ĐỀ NẰM TRÊN ẢNH */}
        <div 
          className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm bg-cover bg-center flex items-end p-6 md:p-10"
          style={{ backgroundImage: `url(${place.thumbnail})` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-indigo-900/25 to-transparent pointer-events-none" />        
        </div>

        {/* 2. BỐ CỤC 2 CỘT CHÍNH */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI: NỘI DUNG GIỚI THIỆU (Để nội dung dài thoải mái) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4">
              <Link href="/places" className="text-[#0F4C75] font-semibold hover:text-[#3282B8] transition inline-flex items-center gap-1 text-sm">
                &larr; Quay lại danh sách
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
                  {place.name}
                </h1>
                <Link href="/map" className="inline-flex justify-center whitespace-nowrap px-6 py-3 bg-[#0F4C75] text-white font-bold rounded-xl shadow-md hover:bg-[#3282B8] transition">
                  Tìm đường đi
                </Link>
              </div>
            </div>

            <div className="h-[2px] w-full bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-transparent" />

            <div className="pt-10 mr-15 space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-[#0F4C75] uppercase">— Giới thiệu</h3>
              <p className="text-slate-600 leading-relaxed pb-5">
                {place.description}
              </p>

              <h3 className="text-sm font-semibold tracking-wider text-[#0F4C75] uppercase">— Trải nghiệm</h3>
              <p className="text-slate-600 leading-relaxed">
                {place.experience}
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: THẺ THÔNG TIN CHI TIẾT */}
          <div className="lg:col-span-1 sticky top-6 bg-white border border-[#3282B8]/30 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Thông tin chi tiết</h3>
              <p className="text-sm text-slate-500 mt-1">Tổng quan chi tiết về tọa độ và thời gian hoạt động.</p>
            </div>

            <AddButton placeId={place.id}/>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <InfoCard title='Tọa độ' value={`${place.lat}, ${place.lng}`} />
              <InfoCard title='Loại hình' value={place.category} />
              <InfoCard title='Giờ mở cửa' value={place.openTime} />
              <InfoCard title='Chi phí' value={place.price} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
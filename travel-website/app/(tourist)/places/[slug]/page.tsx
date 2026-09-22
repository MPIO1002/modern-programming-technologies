import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import InfoCard from '@/components/InfoCard';

// OBJECT
type Place = {
    id: string;
    slug: string;
    name: string;
    description: string;
    thumbnail: string;
    lat: number;
    lng: number;
    category: string;
    openTime: string;
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
        return data[0];
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
        title: `${place.name} | Việt Nam Travel`,
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
        <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 bg-white text-gray-900">
            {/* Hình ảnh */}
            <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-2xl border border-gray-200 shadow-sm bg-cover bg-center"
                style={{ backgroundImage: `url(${place.thumbnail})` }}
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Cột trái: Mô tả */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {place.name}
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">{place.description}</p>
                </div>

                {/* Cột phải: Nút thêm lịch trình */}
                <button className="px-6 py-3 bg-[#5a4bda] hover:bg-[#4a3ebd] text-white font-medium rounded-xl transition-colors flex-shrink-0 shadow-md">
                    Thêm vào lịch trình
                </button>
            </header>

            {/* thông tin chi tiết */}
            <section>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <InfoCard title='Tọa độ' value={`${place.lat}, ${place.lng}`}/>
                    <InfoCard title='Loại hình' value={place.category}/>
                    <InfoCard title='Giờ mở cửa' value={place.openTime}/>
                    <InfoCard title='ID' value={place.id}/>
                </div>
            </section>
        </main>
    );
}
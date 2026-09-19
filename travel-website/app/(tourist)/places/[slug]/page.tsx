import {notFound} from 'next/navigation';

export default async function PlaceDetails({params} : { params: Promise<{ slug: string}>}) {
    const {slug} = await params;

    if(slug === 'not-found') {
        notFound();
    }

    return (
        <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 bg-white text-gray-900">
            {/* Hình ảnh */}
            <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                <span className="text-gray-500 font-medium">Ảnh địa điểm</span>
            </div>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Cột trái: mô tả */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold capitalize text-gray-900">
                        {slug.replace(/-/g, ' ')}
                    </h1>
                    <p className="text-gray-500 mt-2">Dữ liệu tìm theo slug...</p>
                </div>
      
                {/* Cột phải: Nút thêm lịch trình */}
                <button className="px-6 py-3 bg-[#5a4bda] hover:bg-[#4a3ebd] text-white font-medium rounded-xl transition-colors flex-shrink-0 shadow-md">
                    Nút thêm lịch trình
                </button>
            </header>

            {/* Thông tin chi tiết */}
            <section>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Tọa độ</span>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Lịch sử</span>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Giờ mở cửa</span>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Chi phí</span>
                    </div>
                </div>
            </section>
        </main>
    )
}
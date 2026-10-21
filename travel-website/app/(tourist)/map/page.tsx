import type { Metadata } from "next";
import { cookies } from "next/headers";
import MapContainer from "@/components/map/MapContainer";
import { getSavedItineraries } from "@/services/itinerary-server-store";

export const metadata: Metadata = {
  title: "Bản đồ tương tác & Lộ trình du lịch | Vietmap Route Finder",
  description:
    "Tính toán lộ trình tối ưu và khám phá bản đồ du lịch tương tác TP. Hồ Chí Minh với Vietmap API.",
};

/**
 * Server Component (Outer Shell):
 * - Đảm nhiệm sinh metadata, render khung vỏ tĩnh phía server.
 * - Đọc dữ liệu bền vững từ Server Persistence Store (theo định danh guest_id của từng người dùng).
 * - Tự động được re-render khi Server Action kích hoạt revalidatePath('/map').
 * - Đẩy dữ liệu khởi tạo xuống Client Leaf Component (`MapContainer`).
 */
export default async function MapPage() {
  const cookieStore = await cookies();
  const guestId = cookieStore.get("tourist_guest_id")?.value;

  // Đọc danh sách hành trình của người dùng hiện tại từ kho lưu trữ bền vững
  const savedTrips = guestId ? await getSavedItineraries(guestId) : [];

  return (
    <main className="flex-grow w-full relative h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Client Leaf Component: Giữ ranh giới Client ở mức nhỏ nhất */}
      <MapContainer initialSavedTrips={savedTrips} />
    </main>
  );
}

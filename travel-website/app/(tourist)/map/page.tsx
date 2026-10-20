import type { Metadata } from "next";
import MapContainer from "@/components/map/MapContainer";

export const metadata: Metadata = {
  title: "Bản đồ tương tác & Lộ trình du lịch | Vietmap Route Finder",
  description:
    "Tính toán lộ trình tối ưu và khám phá bản đồ du lịch tương tác TP. Hồ Chí Minh với Vietmap API.",
};

/**
 * Server Component (Outer Shell):
 * Đảm nhiệm sinh metadata, render khung vỏ tĩnh phía server,
 * không nạp mã JavaScript tương tác lớn xuống client ban đầu.
 * Đẩy toàn bộ logic bản đồ và tương tác người dùng xuống Client Leaf Component (`MapContainer`).
 */
export default function MapPage() {
  return (
    <main className="flex-grow w-full relative h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Client Leaf Component: Giữ ranh giới Client ở mức nhỏ nhất */}
      <MapContainer />
    </main>
  );
}

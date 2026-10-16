import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm đường – Vietmap Route Finder | TP. Hồ Chí Minh",
  description:
    "Tính toán lộ trình tối ưu giữa các địa danh tại TP. Hồ Chí Minh sử dụng bản đồ Vietmap và Route API v4. Hỗ trợ ô tô, xe máy, xe đạp và đi bộ.",
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

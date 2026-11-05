
import { normalizePlaces } from "@/services/places.service";

export async function getBenchmarkPlaces() {
  const apiUrl = process.env.MOCKAPI_PLACES_URL;

  if (!apiUrl) {
    throw new Error("Thiếu cấu hình MOCKAPI_PLACES_URL");
  }

  // Độ trễ kiểm soát chỉ dành cho thí nghiệm.
  // Đặt BENCHMARK_DELAY_MS=1500 trong .env.local
  // nếu muốn mô phỏng API mất thêm 1,5 giây.
  const delay = Number(process.env.BENCHMARK_DELAY_MS ?? 0);

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const response = await fetch(apiUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Không thể lấy dữ liệu địa điểm (${response.status})`
    );
  }

  return normalizePlaces(await response.json());
}

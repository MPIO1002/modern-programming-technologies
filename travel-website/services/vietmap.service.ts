import type { Vehicle, VietmapRouteResponse, RouteInfo } from "@/types/vietmap";

const ROUTE_API_BASE = "https://maps.vietmap.vn/api/route/v4";

export class VietmapApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "VietmapApiError";
  }
}

/**
 * Calls Vietmap Route API v4 with N ordered waypoints.
 */
export async function fetchVietmapRoute(
  apiKey: string,
  waypoints: Array<{ lat: number; lng: number }>,
  vehicle: Vehicle
): Promise<RouteInfo> {
  if (!apiKey.trim()) {
    throw new VietmapApiError("Chưa cấu hình NEXT_PUBLIC_VIETMAP_API_KEY trong .env.local.");
  }
  if (waypoints.length < 2) {
    throw new VietmapApiError("Cần ít nhất 2 địa điểm để tính đường.");
  }

  const url = new URL(ROUTE_API_BASE);
  url.searchParams.set("apikey", apiKey);
  for (const wp of waypoints) {
    url.searchParams.append("point", `${wp.lat},${wp.lng}`);
  }
  url.searchParams.set("points_encoded", "false");
  url.searchParams.set("vehicle", vehicle);

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new VietmapApiError(
        "API Key không hợp lệ hoặc không có quyền truy cập.",
        response.status
      );
    }
    throw new VietmapApiError(
      `Lỗi máy chủ: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const data: VietmapRouteResponse = await response.json();

  if (!data.paths || data.paths.length === 0) {
    throw new VietmapApiError("Không tìm thấy tuyến đường phù hợp.");
  }

  const path = data.paths[0];

  // Convert [lng, lat] → [lat, lng] for Leaflet
  const coordinates: Array<[number, number]> = path.points.coordinates.map(
    ([lng, lat]) => [lat, lng]
  );

  return {
    distanceKm: parseFloat((path.distance / 1000).toFixed(2)),
    durationMin: parseFloat((path.time / 60000).toFixed(1)),
    coordinates,
  };
}

import type { Vehicle, VietmapRouteResponse, RouteInfo } from "@/types/vietmap";

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
 * Calls internal proxy API which calls Vietmap Route API v4 with N ordered waypoints.
 */
export async function fetchVietmapRoute(
  waypoints: Array<{ lat: number; lng: number }>,
  vehicle: Vehicle
): Promise<RouteInfo> {
  if (waypoints.length < 2) {
    throw new VietmapApiError("Cần ít nhất 2 địa điểm để tính đường.");
  }

  const response = await fetch("/api/vietmap/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ waypoints, vehicle }),
  });

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

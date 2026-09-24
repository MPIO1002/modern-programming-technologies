"use client";

import { useState, useCallback } from "react";
import type { Location, Vehicle, RouteInfo } from "@/types/vietmap";
import { fetchVietmapRoute, VietmapApiError } from "@/services/vietmap.service";

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY ?? "";

interface UseVietmapRouteReturn {
  waypoints: (Location | null)[];
  vehicle: Vehicle;
  routeInfo: RouteInfo | null;
  loading: boolean;
  error: string | null;
  addWaypoint: () => void;
  removeWaypoint: (index: number) => void;
  updateWaypoint: (index: number, loc: Location | null) => void;
  reorderWaypoints: (fromIndex: number, toIndex: number) => void;
  setVehicle: (v: Vehicle) => void;
  calculateRoute: () => Promise<void>;
  clearRoute: () => void;
  clearError: () => void;
}

export function useVietmapRoute(): UseVietmapRouteReturn {
  const [waypoints, setWaypoints] = useState<(Location | null)[]>([null, null]);
  const [vehicle, setVehicle] = useState<Vehicle>("car");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearRoute = useCallback(() => {
    setRouteInfo(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const addWaypoint = useCallback(() => {
    setWaypoints((prev) => [...prev, null]);
    clearRoute();
  }, [clearRoute]);

  const removeWaypoint = useCallback(
    (index: number) => {
      setWaypoints((prev) => prev.filter((_, i) => i !== index));
      clearRoute();
    },
    [clearRoute]
  );

  const updateWaypoint = useCallback(
    (index: number, loc: Location | null) => {
      setWaypoints((prev) => {
        const next = [...prev];
        next[index] = loc;
        return next;
      });
      clearRoute();
    },
    [clearRoute]
  );

  const reorderWaypoints = useCallback(
    (fromIndex: number, toIndex: number) => {
      setWaypoints((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
      clearRoute();
    },
    [clearRoute]
  );

  const calculateRoute = useCallback(async () => {
    const filled = waypoints.filter(Boolean) as Location[];

    if (filled.length < 2) {
      setError("Vui lòng chọn ít nhất 2 địa điểm.");
      return;
    }

    const ids = filled.map((w) => w.id);
    if (new Set(ids).size !== ids.length) {
      setError("Không được chọn trùng địa điểm.");
      return;
    }

    if (!VIETMAP_API_KEY) {
      setError("Chưa cấu hình NEXT_PUBLIC_VIETMAP_API_KEY trong .env.local.");
      return;
    }

    setLoading(true);
    setError(null);
    setRouteInfo(null);

    try {
      const result = await fetchVietmapRoute(
        VIETMAP_API_KEY,
        filled.map((w) => ({ lat: w.lat, lng: w.lng })),
        vehicle
      );
      setRouteInfo(result);
    } catch (err) {
      setError(
        err instanceof VietmapApiError
          ? err.message
          : "Đã xảy ra lỗi không xác định. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }, [waypoints, vehicle]);

  return {
    waypoints,
    vehicle,
    routeInfo,
    loading,
    error,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    reorderWaypoints,
    setVehicle,
    calculateRoute,
    clearRoute,
    clearError,
  };
}

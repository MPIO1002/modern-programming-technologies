"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import RouteControlPanel from "@/components/map/RouteControlPanel";
import { useVietmapRoute } from "@/hooks/useVietmapRoute";
import type { Location, Vehicle } from "@/types/vietmap";
import { getCustomItineraryPlaces } from "@/services/itinerary-storage";
import type { SavedItineraryRecord } from "@/services/itinerary-server-store";

interface RawPlace {
  id: string | number;
  name: string;
  ward?: string;
  address?: string;
  lat: string | number;
  lng: string | number;
}

interface MapContainerProps {
  initialSavedTrips?: SavedItineraryRecord[];
}

// Dynamic import Leaflet component phía client với ssr: false (tránh lỗi 'window is not defined')
const VietmapLeaflet = dynamic(() => import("./VietmapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#3282B8", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-medium">Đang tải bản đồ…</p>
      </div>
    </div>
  ),
});

/**
 * Client Leaf Component: Quản lý toàn bộ state tương tác bản đồ,
 * gọi hook useVietmapRoute, đồng bộ localStorage, lazy load Leaflet và render control panel.
 */
export default function MapContainer({ initialSavedTrips = [] }: MapContainerProps) {
  const {
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
    setWaypoints,
  } = useVietmapRoute();

  const [places, setPlaces] = useState<Location[]>([]);
  const initRef = useRef(false);

  // Xử lý nạp lịch trình đã lưu từ Server Store vào bản đồ
  const handleLoadSavedTrip = useCallback(
    (tripWaypoints: Location[], tripVehicle: Vehicle) => {
      setWaypoints(tripWaypoints);
      setVehicle(tripVehicle);
    },
    [setWaypoints, setVehicle]
  );

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function loadPlacesAndSaved() {
      try {
        const customPlaces = getCustomItineraryPlaces();

        const res = await fetch("/api/places");
        let mappedPlaces: Location[] = [];

        if (res.ok) {
          const data: RawPlace[] = await res.json();
          if (Array.isArray(data)) {
            mappedPlaces = data.map((p) => ({
              id: String(p.id),
              name: p.name,
              address: p.ward || p.address || "",
              lat: Number(p.lat),
              lng: Number(p.lng),
            }));
          }
        }

        const combinedPopular = [...mappedPlaces, ...customPlaces];
        setPlaces(combinedPopular);

        const savedList: number[] = JSON.parse(
          localStorage.getItem("my_list") || "[]"
        );

        let savedRoutePlaces: Location[] = [];
        if (savedList.length > 0 && mappedPlaces.length > 0) {
          const filtered = mappedPlaces.filter((p) =>
            savedList.includes(Number(p.id))
          );
          savedRoutePlaces = filtered.map((p, idx) => ({
            id: `${p.id}-${idx}`,
            name: p.name,
            address: p.address,
            lat: p.lat,
            lng: p.lng,
          }));
        }

        const allSelected: (Location | null)[] = [
          ...savedRoutePlaces,
          ...customPlaces,
        ];

        if (allSelected.length > 0) {
          while (allSelected.length < 2) {
            allSelected.push(null);
          }
          setWaypoints(allSelected);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu địa điểm:", err);
      }
    }

    loadPlacesAndSaved();
  }, [setWaypoints]);

  return (
    <div className="flex-1 relative h-full">
      <VietmapLeaflet waypoints={waypoints} routeInfo={routeInfo} />

      {/* Floating control panel */}
      <RouteControlPanel
        waypoints={waypoints}
        vehicle={vehicle}
        routeInfo={routeInfo}
        loading={loading}
        error={error}
        places={places}
        savedTrips={initialSavedTrips}
        onLoadSavedTrip={handleLoadSavedTrip}
        onUpdate={updateWaypoint}
        onAdd={addWaypoint}
        onRemove={removeWaypoint}
        onReorder={reorderWaypoints}
        onVehicleChange={setVehicle}
        onCalculate={calculateRoute}
        onClear={clearRoute}
        onClearError={clearError}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import MapWrapper from "@/components/map/MapWrapper";
import RouteControlPanel from "@/components/map/RouteControlPanel";
import { useVietmapRoute } from "@/hooks/useVietmapRoute";
import Link from "next/link";
import type { Location } from "@/types/vietmap";

export default function MapPage() {
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

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadWaypoints() {
      if (isLoaded) return;
      try {
        const savedList: number[] = JSON.parse(localStorage.getItem("my_list") || "[]");
        if (savedList.length > 0) {
          // Fetch places from MockAPI
          const res = await fetch("https://6ab0c6fc9751d2b03e6c6e16.mockapi.io/TravelWebsite/places");
          if (res.ok) {
            const data = await res.json();
            const routePlaces = data.filter((p: any) => savedList.includes(Number(p.id)));
            
            if (routePlaces.length > 0) {
              const newWaypoints = routePlaces.map((p: any) => ({
                id: p.id.toString(),
                name: p.name,
                lat: p.lat,
                lng: p.lng,
              }));
              
              // Ensure at least 2 waypoints by padding with null
              while (newWaypoints.length < 2) {
                newWaypoints.push(null);
              }
              
              setWaypoints(newWaypoints);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải lộ trình đã lưu:", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadWaypoints();
  }, [isLoaded, setWaypoints]);

  return (
    <main className="h-screen w-full relative overflow-hidden">
      {/* Fullscreen map */}
      <div className="absolute inset-0">
        <MapWrapper waypoints={waypoints} routeInfo={routeInfo} />
      </div>

      <Link href="/" className="absolute top-4 left-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md font-semibold text-[#0F4C75] hover:bg-[#BBE1FA] transition-colors border border-[#0F4C75]/20 text-sm">
        &larr; Trang chủ
      </Link>

      {/* Floating control panel */}
      <RouteControlPanel
        waypoints={waypoints}
        vehicle={vehicle}
        routeInfo={routeInfo}
        loading={loading}
        error={error}
        onUpdate={updateWaypoint}
        onAdd={addWaypoint}
        onRemove={removeWaypoint}
        onReorder={reorderWaypoints}
        onVehicleChange={setVehicle}
        onCalculate={calculateRoute}
        onClear={clearRoute}
        onClearError={clearError}
      />
    </main>
  );
}

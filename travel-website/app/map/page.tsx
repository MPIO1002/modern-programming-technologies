"use client";

import MapWrapper from "@/components/map/MapWrapper";
import RouteControlPanel from "@/components/map/RouteControlPanel";
import { useVietmapRoute } from "@/hooks/useVietmapRoute";
import Link from "next/link";

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
  } = useVietmapRoute();

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

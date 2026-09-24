"use client";

import MapWrapper from "@/components/map/MapWrapper";
import RouteControlPanel from "@/components/map/RouteControlPanel";
import { useVietmapRoute } from "@/hooks/useVietmapRoute";

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

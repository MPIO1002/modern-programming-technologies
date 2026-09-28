"use client";

import { useEffect, useState, useRef } from "react";
import MapWrapper from "@/components/map/MapWrapper";
import RouteControlPanel from "@/components/map/RouteControlPanel";
import { useVietmapRoute } from "@/hooks/useVietmapRoute";
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

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function loadSavedPlaces() {
      try {
        const savedList: number[] = JSON.parse(localStorage.getItem("my_list") || "[]");
        if (savedList.length > 0) {
          const res = await fetch("https://6ab0c6fc9751d2b03e6c6e16.mockapi.io/TravelWebsite/places");
          if (res.ok) {
            const data = await res.json();
            const routePlaces = data.filter((p: any) => savedList.includes(Number(p.id)));
            
            if (routePlaces.length > 0) {
              const newWaypoints: (Location | null)[] = routePlaces.map((p: any) => ({
                id: p.id.toString(),
                name: p.name,
                address: p.ward || p.address || "",
                lat: Number(p.lat),
                lng: Number(p.lng),
              }));
              
              while (newWaypoints.length < 2) {
                newWaypoints.push(null);
              }
              
              setWaypoints(newWaypoints);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải lộ trình đã lưu:", err);
      }
    }
    
    loadSavedPlaces();
  }, [setWaypoints]);

  return (
    <main className="flex-grow w-full relative h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Main map area */}
      <div className="flex-1 relative h-full">
        <MapWrapper waypoints={waypoints} routeInfo={routeInfo} />
        
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
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import MapWrapper from "@/components/map/MapWrapper";
import RouteControlPanel from "@/components/map/RouteControlPanel";
import { useVietmapRoute } from "@/hooks/useVietmapRoute";
import type { Location } from "@/types/vietmap";
import { getCustomItineraryPlaces } from "@/services/itinerary-storage";

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
        const customPlaces = getCustomItineraryPlaces();

        if (savedList.length > 0) {
          const res = await fetch("/api/places");
          if (!res.ok) {
            throw new Error(`Không thể tải địa điểm đã lưu (${res.status})`);
          }

          const data = await res.json();
          const routePlaces = Array.isArray(data)
            ? data.filter((place: { id: string | number }) =>
                savedList.includes(Number(place.id))
              )
            : [];
          const savedRoutePlaces: Location[] = routePlaces.map(
            (
              place: {
                id: string | number;
                name: string;
                ward?: string;
                address?: string;
                lat: number | string;
                lng: number | string;
              },
              index: number
            ) => ({
              id: `${place.id}-${index}`,
              name: place.name,
              address: place.ward || place.address || "",
              lat: Number(place.lat),
              lng: Number(place.lng),
            })
          );
          const places = [...savedRoutePlaces, ...customPlaces];
          setWaypoints([...places, null, null].slice(0, Math.max(2, places.length)));
        } else if (customPlaces.length > 0) {
          setWaypoints(
            [...customPlaces, null, null].slice(
              0,
              Math.max(2, customPlaces.length)
            )
          );
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

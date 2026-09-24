"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Polyline, Marker } from "leaflet";
import type { Location, RouteInfo } from "@/types/vietmap";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/constants/locations";
import "leaflet/dist/leaflet.css";

interface VietmapLeafletProps {
  waypoints: (Location | null)[];
  routeInfo: RouteInfo | null;
}

const VIETMAP_API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY ?? "";

function getTileConfig() {
  if (VIETMAP_API_KEY) {
    return {
      url: `https://maps.vietmap.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=${VIETMAP_API_KEY}`,
      attribution: '&copy; <a href="https://vietmap.vn">VietMap</a>',
    };
  }
  return {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };
}

/** Color for each waypoint marker based on its position in the list */
function getMarkerColor(index: number, total: number): string {
  if (index === 0) return "#22c55e";
  if (index === total - 1) return "#ef4444";
  return "#3282B8";
}

function createSvgMarker(color: string, label: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require("leaflet") as typeof import("leaflet");
  return L.divIcon({
    className: "",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 46" width="32" height="46">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 30 16 30S32 28 32 16C32 7.163 24.837 0 16 0z"
          fill="${color}" stroke="#fff" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" dominant-baseline="middle"
          font-family="Montserrat,sans-serif" font-size="11" font-weight="700" fill="#fff">
          ${label}
        </text>
      </svg>`,
    iconSize: [32, 46],
    iconAnchor: [16, 46],
    popupAnchor: [0, -48],
  });
}

export default function VietmapLeaflet({
  waypoints,
  routeInfo,
}: VietmapLeafletProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const polylineRef = useRef<Polyline | null>(null);

  // ── Initialize map ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const tile = getTileConfig();
    const tileLayer = L.tileLayer(tile.url, {
      attribution: tile.attribution,
      maxZoom: 20,
    }).addTo(map);

    if (VIETMAP_API_KEY) {
      let errorCount = 0;
      tileLayer.on("tileerror", () => {
        errorCount++;
        if (errorCount === 3) {
          map.removeLayer(tileLayer);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 20,
          }).addTo(map);
        }
      });
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update markers ────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    // Remove old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    const filled = waypoints.filter(Boolean) as Location[];
    const total = filled.length;

    filled.forEach((loc, idx) => {
      const color = getMarkerColor(idx, total);
      const label =
        idx === 0 ? "A" : idx === total - 1 ? String.fromCharCode(65 + idx) : String.fromCharCode(65 + idx);
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createSvgMarker(color, label),
      })
        .addTo(map)
        .bindPopup(`<b>${label}. ${loc.name}</b><br/><small>${loc.address}</small>`);
      markersRef.current.push(marker);
    });

    // Fit bounds to all markers when no route yet
    if (filled.length >= 2 && !routeInfo) {
      const bounds = L.latLngBounds(filled.map((l) => [l.lat, l.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [waypoints, routeInfo]);

  // ── Draw / clear polyline ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (!routeInfo) return;

    const polyline = L.polyline(routeInfo.coordinates, {
      color: "#3282B8",
      weight: 6,
      opacity: 0.9,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(map);

    polylineRef.current = polyline;
    map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
  }, [routeInfo]);

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%", minHeight: "100vh" }}
    />
  );
}

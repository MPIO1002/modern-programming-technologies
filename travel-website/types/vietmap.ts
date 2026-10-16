// ─── Location ────────────────────────────────────────────────────────────────
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// ─── Vehicle ─────────────────────────────────────────────────────────────────
export type Vehicle = "car" | "motorcycle" | "foot";

export interface VehicleOption {
  value: Vehicle;
  label: string;
}

export const VEHICLE_OPTIONS: VehicleOption[] = [
  { value: "car", label: "Ô tô" },
  { value: "motorcycle", label: "Xe máy" },
  { value: "foot", label: "Đi bộ" },
];

// ─── Vietmap Route API v4 Request ────────────────────────────────────────────
export interface VietmapRouteRequest {
  apikey: string;
  points: Array<{ lat: number; lng: number }>;
  vehicle: Vehicle;
  points_encoded: boolean;
}

// ─── Vietmap Route API v4 Response ───────────────────────────────────────────
export interface VietmapRoutePoint {
  type: "LineString";
  coordinates: Array<[number, number]>; // [lng, lat]
}

export interface VietmapRoutePath {
  distance: number;       // metres
  time: number;           // milliseconds
  points: VietmapRoutePoint;
  bbox: [number, number, number, number];
  snapped_waypoints?: VietmapRoutePoint;
}

export interface VietmapRouteResponse {
  paths: VietmapRoutePath[];
  info?: {
    copyrights?: string[];
    took?: number;
  };
}

// ─── Processed Route Info ────────────────────────────────────────────────────
export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  coordinates: Array<[number, number]>; // [lat, lng] for Leaflet
}

// ─── Hook State ──────────────────────────────────────────────────────────────
export interface UseVietmapRouteState {
  startPoint: Location | null;
  endPoint: Location | null;
  vehicle: Vehicle;
  apiKey: string;
  routeInfo: RouteInfo | null;
  loading: boolean;
  error: string | null;
}

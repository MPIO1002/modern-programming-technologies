import { NextResponse } from "next/server";

const ROUTE_API_BASE = "https://maps.vietmap.vn/api/route/v4";
const ALLOWED_VEHICLES = new Set([
  "car",
  "motorcycle",
  "foot",
]);

interface RouteWaypoint {
  lat: number;
  lng: number;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body phải là JSON hợp lệ." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body không hợp lệ." },
      { status: 400 }
    );
  }

  const { waypoints, vehicle } = body as {
    waypoints?: unknown;
    vehicle?: unknown;
  };

  if (
    !Array.isArray(waypoints) ||
    waypoints.length < 2 ||
    waypoints.length > 25
  ) {
    return NextResponse.json(
      { error: "waypoints phải là mảng từ 2 đến 25 điểm." },
      { status: 400 }
    );
  }

  for (const waypoint of waypoints) {
    if (
      !waypoint ||
      typeof waypoint !== "object" ||
      Array.isArray(waypoint)
    ) {
      return NextResponse.json(
        { error: "Điểm dừng không hợp lệ." },
        { status: 400 }
      );
    }

    const { lat, lng } = waypoint as Partial<RouteWaypoint>;
    if (
      !isFiniteNumber(lat) ||
      !isFiniteNumber(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return NextResponse.json(
        { error: "Tọa độ điểm dừng không hợp lệ." },
        { status: 400 }
      );
    }
  }

  const safeVehicle =
    typeof vehicle === "string" && ALLOWED_VEHICLES.has(vehicle)
      ? vehicle
      : "car";

  try {
    // Use VIETMAP_API_KEY from environment variables on the server
    const apiKey = process.env.VIETMAP_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình VIETMAP_API_KEY trên server." },
        { status: 500 }
      );
    }

    const url = new URL(ROUTE_API_BASE);
    url.searchParams.set("apikey", apiKey);
    
    // Add waypoints
    for (const wp of waypoints) {
      const { lat, lng } = wp as RouteWaypoint;
      url.searchParams.append("point", `${lat},${lng}`);
    }
    url.searchParams.set("points_encoded", "false");
    url.searchParams.set("vehicle", safeVehicle);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
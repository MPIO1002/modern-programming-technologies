import { NextResponse } from "next/server";

const ROUTE_API_BASE = "https://maps.vietmap.vn/api/route/v4";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { waypoints, vehicle } = body;

    // Use VIETMAP_API_KEY from environment variables on the server
    const apiKey = process.env.VIETMAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY;

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
      url.searchParams.append("point", `${wp.lat},${wp.lng}`);
    }
    url.searchParams.set("points_encoded", "false");
    url.searchParams.set("vehicle", vehicle);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

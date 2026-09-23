import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.VIETMAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "VIETMAP_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const vietmapUrl = new URL(
    "https://maps.vietmap.vn/api/reverse/v4"
  );

  vietmapUrl.searchParams.set("apikey", apiKey);
  vietmapUrl.searchParams.set("lat", lat);
  vietmapUrl.searchParams.set("lng", lng);

  // New address format:
  // phường/xã + tỉnh/thành phố
  vietmapUrl.searchParams.set("display_type", "1");

  try {
    const response = await fetch(vietmapUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Vietmap reverse error:", errorText);

      return NextResponse.json(
        { error: "Vietmap reverse API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reverse error:", error);

    return NextResponse.json(
      { error: "Failed to connect to Vietmap reverse API" },
      { status: 500 }
    );
  }
}
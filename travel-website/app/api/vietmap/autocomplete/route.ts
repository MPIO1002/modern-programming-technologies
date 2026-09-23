import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const text = searchParams.get("text");
  const focus = searchParams.get("focus");

  const cityId = searchParams.get("cityId");
  const wardId = searchParams.get("wardId");
  const cats = searchParams.get("cats");

  if (!text || text.trim().length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.VIETMAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "VIETMAP_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const vietmapUrl = new URL(
    "https://maps.vietmap.vn/api/autocomplete/v4"
  );

  vietmapUrl.searchParams.set("apikey", apiKey);
  vietmapUrl.searchParams.set("text", text.trim());

  // GIỮ behavior search cũ
  // Hỗ trợ cả format địa chỉ mới + cũ
  vietmapUrl.searchParams.set("display_type", "5");

  // Không set layers ở đây.
  // Nếu set layers=POI thì search địa chỉ bình thường sẽ bị giới hạn.

  if (focus) {
    vietmapUrl.searchParams.set("focus", focus);
  }

  if (cityId) {
    vietmapUrl.searchParams.set("cityId", cityId);
    vietmapUrl.searchParams.set("admin_new", "true");
  }

  if (wardId) {
    vietmapUrl.searchParams.set("wardId", wardId);
    vietmapUrl.searchParams.set("admin_new", "true");
  }

  if (cats) {
    vietmapUrl.searchParams.set("cats", cats);
  }

  try {
    const response = await fetch(vietmapUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Vietmap error:", errorText);

      return NextResponse.json(
        { error: "Vietmap API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Autocomplete error:", error);

    return NextResponse.json(
      { error: "Failed to connect to Vietmap" },
      { status: 500 }
    );
  }
}
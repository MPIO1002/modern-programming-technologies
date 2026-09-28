import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const text = searchParams.get("text")?.trim() ?? "";
  const layer = searchParams.get("layer");
  const cityId = searchParams.get("cityId");

  const apiKey = process.env.VIETMAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "VIETMAP_API_KEY is not configured" },
      { status: 500 }
    );
  }

  if (text.length < 2) {
    return NextResponse.json([]);
  }

  if (layer !== "CITY" && layer !== "WARD") {
    return NextResponse.json(
      {
        error: "layer must be CITY or WARD",
      },
      { status: 400 }
    );
  }

  const vietmapUrl = new URL(
    "https://maps.vietmap.vn/api/autocomplete/v4"
  );

  vietmapUrl.searchParams.set("apikey", apiKey);
  vietmapUrl.searchParams.set("text", text);
  vietmapUrl.searchParams.set("display_type", "1");
  vietmapUrl.searchParams.set("layers", layer);
  vietmapUrl.searchParams.set("admin_new", "true");

  /*
   * Khi tìm phường/xã thì giới hạn trong tỉnh
   * đã chọn.
   */
  if (layer === "WARD" && cityId) {
    vietmapUrl.searchParams.set("cityId", cityId);
  }

  try {
    const response = await fetch(vietmapUrl.toString(), {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Vietmap administrative error:", data);

      return NextResponse.json(
        {
          error: "Vietmap administrative API failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Administrative API error:", error);

    return NextResponse.json(
      {
        error: "Failed to connect to Vietmap",
      },
      { status: 500 }
    );
  }
}
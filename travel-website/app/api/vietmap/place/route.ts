import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ref_id = searchParams.get("ref_id");

    if (!ref_id) {
      return NextResponse.json(
        { error: "ref_id is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.VIETMAP_API_KEY;

    if (!apiKey) {
      console.error("VIETMAP_API_KEY is not defined");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const url = `https://maps.vietmap.vn/api/place/v3?apikey=${apiKey}&refid=${ref_id}`;

    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: "Vietmap API error", status: res.status, details: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Vietmap place error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details", message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MOCKAPI_PLACES_URL as string;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch places list' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.PLACES_API_URL as string;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch places' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = process.env.PLACES_API_URL as string;
  
  try {
    const body = await request.json();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to create place' }, { status: res.status });
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy post error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

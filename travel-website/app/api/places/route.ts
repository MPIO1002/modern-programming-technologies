import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.MOCKAPI_PLACES_URL as string;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch places' }, { status: res.status });
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      const seenIds = new Set<string>();
      const sanitized = data.map((item: any, idx: number) => {
        let idStr = item.id ? item.id.toString() : String(idx + 1);
        if (seenIds.has(idStr)) {
          idStr = String(idx + 1);
          if (seenIds.has(idStr)) {
            idStr = `${item.id}_${idx}`;
          }
        }
        seenIds.add(idStr);
        // Chuẩn hóa category nếu là mã nội bộ của Vietmap (ví dụ 1002-6)
        let category = item.category || "Khám phá";
        if (category === "1002-6" || /^\d+(-\d+)?$/.test(category)) {
          category = "Khám phá";
        }

        // Đảm bảo có thumbnail hợp lệ
        const thumbnail = item.thumbnail || "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=60";

        // Chuẩn hóa slug nếu MockAPI tạo slug rỗng hoặc "slug 9"
        let slug = item.slug;
        if (!slug || slug.startsWith("slug ")) {
          slug = item.name
            ? item.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            : `place-${idStr}`;
        }

        return {
          ...item,
          id: idStr,
          category,
          thumbnail,
          slug,
        };
      });
      return NextResponse.json(sanitized);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = process.env.MOCKAPI_PLACES_URL as string;
  
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

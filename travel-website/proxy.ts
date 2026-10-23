import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Chỉ can thiệp vào các yêu cầu hướng tới cụm Route Handlers /api/vietmap/*
  if (request.nextUrl.pathname.startsWith('/api/vietmap')) {
    const startTime = Date.now();
    
    // Ghi log yêu cầu tại tầng biên (Edge Runtime/Proxy logging)
    const method = request.method;
    const pathname = request.nextUrl.pathname;
    
    // Tạo response tiếp tục chuỗi xử lý
    const response = NextResponse.next();
    const duration = Date.now() - startTime;

    // Gắn header theo dõi độ trễ ở tầng biên (Latency Observability)
    response.headers.set('X-Response-Time', `${duration}ms`);
    response.headers.set('X-Vietmap-Proxy', 'Nextjs-AppRouter-Secure');

    // In nhật ký truy cập vào terminal server
    console.log(`[Edge Proxy] ${method} ${pathname} - Processed in ${duration}ms`);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/vietmap/:path*'],
};

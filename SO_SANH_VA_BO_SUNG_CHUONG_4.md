# BÁO CÁO ĐỐI SOÁT VÀ HƯỚNG DẪN BỔ SUNG CHƯƠNG 4
**Đề tài:** Hệ thống tối ưu lộ trình du lịch với VIETMAP API (Next.js 16)  
**Môn học:** Các công nghệ lập trình hiện đại  
**Giảng viên hướng dẫn:** TS. Phạm Thi Vương  

---

## I. TỔNG QUAN ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG

Đối chiếu nội dung **Chương 4: Bản chất công nghệ - Bắt buộc lõi (Tầng 1 - Điều kiện cần)** trong file báo cáo PDF (trang 14 – 32) với **Yêu cầu của Giảng viên** trong ảnh hướng dẫn:

| Tiêu chí của Giảng viên | Hiện trạng trong PDF | Đánh giá & Mức độ |
| :--- | :--- | :--- |
| **1. Cấu trúc tiểu mục theo Phần F (Tầng 1A)** | Đã chia đủ 4 phần: 4.1 App Router, 4.2 Server vs Client Component, 4.3 Data fetching Server, 4.4 Luồng render chính | ✅ **ĐẠT** về mặt dàn ý |
| **2. Bảng tổng hợp đối soát đầu chương** | Chưa có bảng 4 cột theo đúng biểu mẫu giảng viên yêu cầu | ❌ **CHƯA CÓ (BẮT BUỘC BỔ SUNG)** |
| **3. Chuỗi chứng minh 4 bước:**<br>*(Khái niệm/Cơ chế $\rightarrow$ Mã nguồn thực tế $\rightarrow$ Kết quả $\rightarrow$ Ý nghĩa/Vị trí)* | Mới chỉ có **Khái niệm** và **Ý nghĩa lý thuyết**. Phần **Mã nguồn thực tế** còn thiếu (đang dùng code ví dụ chung chung `ClientWrapper.tsx` ở trang 28), **thiếu kết quả/log/ảnh chụp/số dòng**. | ⚠️ **THIẾU TRẦM TRỌNG MINH CHỨNG THỰC TẾ** |
| **4. Trả lời câu hỏi tự kiểm:**<br>*Next.js khác gì một React SPA thuần trong đồ án?* | Mới nêu rải rác trong các đoạn văn lý thuyết, chưa đúc kết thành minh chứng rõ ràng gắn với bài toán du lịch. | ⚠️ **CẦN LÀM RÕ RÀNG HƠN** |

---

## II. CHI TIẾT CÁC PHẦN CẦN BỔ SUNG & SỬA ĐỔI

### 1. Bổ sung Bảng Tổng hợp Yêu cầu Lõi (Đặt ngay dưới tiêu đề Chương 4)
Giảng viên yêu cầu một bảng đối soát minh chứng cụ thể. Nhóm cần chèn bảng này vào trang đầu tiên của Chương 4:

#### 👉 Bảng chuẩn hóa cần đưa vào báo cáo:

| TT | Yêu cầu bắt buộc lõi (theo Phần F) | Cơ chế cần giải thích (tiểu mục báo cáo) | Minh chứng thực hành (file / dòng / log) | Vị trí và ý nghĩa trong đồ án |
|:---|:---|:---|:---|:---|
| **1** | **App Router & Cây Route** | Cấu trúc thư mục, Route Group `(tourist)`, Dynamic Route `[slug]`, Special Files (`page.tsx`, `layout.tsx`, `not-found.tsx`, `route.ts`). | - `app/(tourist)/map/page.tsx`<br>- `app/(tourist)/places/[slug]/page.tsx`<br>- `app/(tourist)/places/[slug]/not-found.tsx`<br>- `app/api/vietmap/route/route.ts`<br>- Kết quả `next build` (Route Tree). | Định tuyến toàn bộ ứng dụng du lịch; nhóm giao diện người dùng không làm đổi URL; định tuyến động cho từng địa điểm du lịch; bảo mật proxy API Vietmap. |
| **2** | **Phân biệt Server & Client Component** | Ranh giới Server/Client, chỉ thị `'use client'`, quy tắc Leaf Component, RSC Flight Payload. | - Server: `app/(tourist)/map/page.tsx`<br>- Client: `components/layout/SidebarItinerary.tsx` (Dòng 1: `'use client'`), `components/map/RouteControlPanel.tsx`<br>- Network Tab: RSC Payload. | Tối ưu kích thước bundle JavaScript; chỉ nạp JS tương tác cho bản đồ và thanh công cụ hành trình; giữ phần khung và logic bảo mật trên máy chủ. |
| **3** | **Truy xuất dữ liệu phía Server trong Server Component** | Fetch dữ liệu trực tiếp tại Server Component, Async/Await ở cấp component, bảo mật Secret Key. | - `app/(tourist)/places/[slug]/page.tsx` (fetch/đọc dữ liệu địa điểm trực tiếp phía Server).<br>- Không dùng `useEffect`/`useState` để fetch ban đầu. | Tránh hiện tượng nhấp nháy giao diện (Network Waterfall), hỗ trợ SEO địa điểm du lịch, không làm lộ thông tin nhạy cảm xuống Client. |
| **4** | **Luồng render chính của đồ án** | Vòng đời 1 request: Server render HTML tĩnh $\rightarrow$ Fast FCP $\rightarrow$ Gửi RSC Payload $\rightarrow$ Hydration Client Component (Leaflet/Vietmap Map) $\rightarrow$ Tương tác. | - Luồng vào route `/map` hoặc `/places/[slug]`.<br>- Log terminal khi Server render.<br>- Log trình duyệt khi Hydration hoàn tất tại `MapViewer`. | Đảm bảo tốc độ hiển thị tức thì cho du khách khi tra cứu bản đồ/địa điểm, đồng thời duy trì khả năng tương tác mượt mà với bản đồ số. |

---

### 2. Chi tiết cần bổ sung cho từng tiểu mục (Theo chuỗi 4 bước)

#### 📌 Tiểu mục 4.1: App Router (Trang 14 – 23 PDF)
* **Hiện trạng trong PDF:** Đã vẽ cây thư mục và giải thích các file `layout.tsx`, `page.tsx`, `not-found.tsx`, `route.ts`.
* **Cần bổ sung:**
  1. **Mã nguồn thực tế (Code snippet thật từ dự án):**
     - Trích đoạn code thật của `app/(tourist)/places/[slug]/page.tsx` (chỉ ra cách nhận `params: Promise<{ slug: string }>` trong Next.js 15/16).
     - Trích đoạn code `app/(tourist)/places/[slug]/not-found.tsx` khi slug không tồn tại.
     - Trích đoạn code Route Handler `app/api/vietmap/route/route.ts` xử lý POST proxy tới VietMap API.
  2. **Minh chứng kết quả:**
     - Chèn hình ảnh chụp kết quả chạy lệnh `npm run build` (hoặc `pnpm build`): bảng hiển thị các route `○ (Static)` và `ƒ (Dynamic)` của Next.js để chứng minh cây route được Next.js biên dịch thực tế.
     - Ảnh chụp trình duyệt khi vào URL `/places/da-lat` (chứng minh Dynamic Segment hoạt động) và khi vào slug sai dẫn đến giao diện `not-found.tsx`.

---

#### 📌 Tiểu mục 4.2: Phân biệt Server Component và Client Component (Trang 23 – 29 PDF)
* **Hiện trạng trong PDF:** Lý thuyết rất tốt, có bảng so sánh 4.2.3. Tuy nhiên ở trang 28 đang dùng code ví dụ chung chung (`ClientWrapper`, `ServerDataList`).
* **Cần bổ sung:**
  1. **Thay thế code mẫu bằng Mã nguồn thực tế của dự án:**
     - **Client Component:** Trích mã nguồn file [SidebarItinerary.tsx](file:///c:/Users/huynh/modern-programming-technologies/travel-website/components/layout/SidebarItinerary.tsx#L1) hoặc [RouteControlPanel.tsx](file:///c:/Users/huynh/modern-programming-technologies/travel-website/components/map/RouteControlPanel.tsx#L1). Chỉ rõ dòng 1 có `'use client'`, giải thích lý do bắt buộc phải dùng Client Component (do sử dụng `useState`, `useEffect`, gọi hook bản đồ `useVietmapRoute`, lắng nghe sự kiện bấm nút kéo thả điểm đến).
     - **Server Component:** Trích mã nguồn file `app/(tourist)/map/page.tsx` đóng vai trò Server Component cha, bao bọc và nhúng các Client Component con xuống lá (Leaf Components).
  2. **Minh chứng kết quả:**
     - Ảnh chụp DevTools Network lọc gói tin `map?_rsc=...` (RSC Payload dạng text/x-component) để chứng minh Next.js gửi cấu trúc giao diện chứ không gửi toàn bộ mã nguồn server xuống client.

---

#### 📌 Tiểu mục 4.3: Truy xuất dữ liệu phía máy chủ trong Server Component (Trang 29 – 30 PDF)
* **Hiện trạng trong PDF:** Đang viết thuần mô tả văn xuôi ở các mục 4.3.1, 4.3.2, 4.3.3. Hoàn toàn chưa có mã nguồn minh chứng.
* **Cần bổ sung:**
  1. **Mã nguồn thực tế:**
     - Trích đoạn code trong `app/(tourist)/places/[slug]/page.tsx` thể hiện hàm async fetch dữ liệu danh sách/chi tiết địa điểm:
       ```tsx
       // Minh chứng: Server Component đọc dữ liệu trực tiếp không qua Client fetch
       export default async function PlaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
         const { slug } = await params;
         // Gọi dữ liệu trực tiếp trên server
         const place = await getPlaceBySlug(slug);
         if (!place) notFound();
         return <PlaceDetailView place={place} />;
       }
       ```
     - Đối chiếu với cách làm cũ của React SPA (phải dùng `useEffect` + `useState` + hiện spinner loading) để làm nổi bật ưu thế không bị *Network Waterfall*.
  2. **Minh chứng kết quả:**
     - Ảnh chụp "View Page Source" (Ctrl + U) trên trình duyệt: cho thấy nội dung văn bản, tiêu đề địa điểm đã có sẵn trong HTML trả về từ server (tốt cho SEO), không phải trang HTML trắng rỗng `<div id="root"></div>` như React SPA.

---

#### 📌 Tiểu mục 4.4: Phân tích luồng render chính của đồ án (Trang 31 – 32 PDF)
* **Hiện trạng trong PDF:** Đã phân tích 5 bước (Initial Request $\rightarrow$ Server Rendering $\rightarrow$ Phân phối tức thời $\rightarrow$ Hydration $\rightarrow$ Giao tiếp xuyên biên giới).
* **Cần bổ sung:**
  1. **Sơ đồ trực quan (Sequence Diagram / Flowchart):**
     - Giảng viên chấm bài rất chú trọng sơ đồ luồng dữ liệu thực tế. Cần vẽ 1 sơ đồ thể hiện rõ tương tác giữa: **Browser (User) $\leftrightarrow$ Next.js Server (RSC & API Proxy) $\leftrightarrow$ VietMap Cloud API**.
  2. **Gắn với kịch bản cụ thể của đồ án du lịch:**
     - Kịch bản: *Du khách mở trang `/map` $\rightarrow$ Server render layout tĩnh và gửi HTML/RSC $\rightarrow$ Client nạp JS bản đồ Leaflet $\rightarrow$ Người dùng thêm 3 điểm tham quan $\rightarrow$ Client gọi API `/api/vietmap/route` $\rightarrow$ Next.js Proxy bảo mật gọi Vietmap API $\rightarrow$ Trả kết quả vẽ đường polyline lên bản đồ*.

---

## III. TRẢ LỜI CÂU HỎI TỰ KIỂM TRA CỦA GIẢNG VIÊN

> **Câu hỏi:** *"Cái gì trong đồ án này là Next.js, mà một dự án không dùng công nghệ này (chỉ dùng React SPA thuần) sẽ không làm giống như vậy?"*

Nhóm cần bổ sung bảng đối chiếu này vào phần kết luận của Chương 4:

| Đặc điểm kiến trúc | Next.js App Router (Đồ án của nhóm) | React SPA thuần (Vite / CRA) |
| :--- | :--- | :--- |
| **Định tuyến (Routing)** | Định tuyến theo hệ thống thư mục (`app/(tourist)/map`, `[slug]`). Tự động tách code theo từng segment. | Phải cấu hình thủ công qua thư viện bên ngoài (`react-router-dom`), dễ phình to bundle chính nếu không tự cấu hình lazy load. |
| **Môi trường thực thi mặc định** | Mọi component mặc định là **Server Component**. Logic và mã thư viện nặng chỉ chạy trên server (0 KB bundle gửi về client). | 100% component chạy tại Client trên trình duyệt người dùng. Toàn bộ mã nguồn bị lộ trong JS Bundle. |
| **Lấy dữ liệu (Data Fetching)** | Lấy dữ liệu trực tiếp tại Server Component qua `async/await`. HTML sinh ra đã có đầy đủ dữ liệu ngay lần đầu tải. | Phải tải bundle JS về, render trang trắng, kích hoạt `useEffect` rồi mới gọi API (gây Network Waterfall và nhấp nháy màn hình). |
| **Bảo mật API Key bên thứ 3 (VIETMAP)** | Sử dụng **Route Handler (`app/api/vietmap/.../route.ts`)** làm Reverse Proxy. API Key lưu trong biến môi trường server `.env.local`, trình duyệt hoàn toàn không thấy key. | Nếu không dựng backend riêng, React SPA buộc phải gọi thẳng API Vietmap từ client $\rightarrow$ Lộ API Key trong Network Tab và mã nguồn client. |
| **Quá trình nạp bản đồ tương tác** | Phân tách rõ: Server render khung bao ngoài tĩnh; chỉ định riêng component bản đồ dùng `'use client'` để hydrate và thao tác DOM/WebGL. | Bản đồ và toàn bộ trang bị buộc phải đóng gói chung một luồng xử lý ở client. |

---

## IV. BẢN KẾ HOẠCH HÀNH ĐỘNG CỤ THỂ CHO NHÓM

1. [ ] **Thêm Bảng Tổng hợp Yêu cầu Lõi** (ở Mục I bên trên) vào ngay đầu Chương 4 (trang 14).
2. [ ] **Chụp 4 ảnh minh chứng thực tế từ dự án:**
   - Ảnh 1: Kết quả terminal chạy `pnpm build` hoặc `npm run build` (cho thấy cây route tĩnh/động).
   - Ảnh 2: Ảnh trình duyệt vào `/places/da-lat` và ảnh "View Source" có sẵn HTML dữ liệu địa điểm.
   - Ảnh 3: Ảnh trình duyệt mở Network tab thấy gói `_rsc` (RSC Flight Payload).
   - Ảnh 4: Ảnh trình duyệt mở Network tab gọi `/api/vietmap/route` chỉ thấy URL nội bộ localhost, không lộ key của Vietmap.
3. [ ] **Thay thế code mẫu generic ở trang 28** bằng đoạn code thực tế trích từ `app/(tourist)/map/page.tsx` và `components/layout/SidebarItinerary.tsx` (chỉ rõ số dòng).
4. [ ] **Chèn Sơ đồ Luồng Render** (Sequence Diagram) vào mục 4.4.
5. [ ] **Thêm Bảng So sánh Đối chiếu với React SPA** (Mục III) vào cuối Chương 4.

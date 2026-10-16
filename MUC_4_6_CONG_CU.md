# CHƯƠNG 4: BẢN CHẤT CÔNG NGHỆ - BẮT BUỘC (TẦNG 1 - ĐIỀU KIỆN CẦN)

## 4.6. Công cụ

### Khái niệm

Trong kiến trúc của Next.js 16, hệ thống công cụ phát triển và đóng gói đóng vai trò cốt lõi trong việc chuẩn hóa chất lượng mã nguồn, rút ngắn thời gian phản hồi khi lập trình và xác định phương thức phục vụ của từng tài nguyên trên máy chủ. Mục này tập trung vào ba thành phần nền tảng gồm ngôn ngữ TypeScript, trình đóng gói Turbopack và chu trình vận hành ứng dụng thông qua các câu lệnh chuẩn.

TypeScript là ngôn ngữ mở rộng của JavaScript, bổ sung hệ thống kiểm tra kiểu dữ liệu tĩnh ngay trong quá trình viết mã và biên dịch. Khi áp dụng vào đồ án, TypeScript thiết lập các hợp đồng dữ liệu nghiêm ngặt giữa các thành phần giao diện, các hàm xử lý logic và dữ liệu trả về từ máy chủ, ngăn chặn sớm các lỗi truy xuất sai cấu trúc trước khi mã nguồn được chạy thực tế.

Turbopack là động cơ đóng gói mã nguồn thế hệ mới được xây dựng bằng ngôn ngữ Rust, thay thế hoàn toàn Webpack để trở thành trình bundler mặc định cho môi trường phát triển kể từ Next.js phiên bản 16. Khác với cách tiếp cận đóng gói toàn bộ dự án trước đây, Turbopack áp dụng cơ chế biên dịch lười biếng theo nhu cầu truy cập thực tế và lưu đệm ở cấp độ hàm. Khi có thay đổi trong tệp mã nguồn, Turbopack chỉ tính toán lại các khối lệnh bị tác động và đẩy bản cập nhật xuống trình duyệt mà không phải biên dịch lại toàn bộ ứng dụng.

Chu trình vận hành ứng dụng Next.js được tiêu chuẩn hóa thông qua ba câu lệnh chính gồm next dev, next build và next start. Lệnh next dev khởi động máy chủ thử nghiệm kết hợp cùng Turbopack để phục vụ quá trình phát triển mã nguồn với tốc độ phản hồi nhanh. Lệnh next build thực hiện tiền xử lý toàn diện, chạy kiểm tra toàn bộ lỗi kiểu dữ liệu TypeScript, tối ưu hóa các tệp tài nguyên tĩnh, đóng gói các đoạn mã JavaScript và phân tích cấu trúc định tuyến của ứng dụng. Sau khi bản build hoàn tất, lệnh next start được sử dụng để khởi chạy máy chủ Node.js trong môi trường triển khai thực tế mà không cần nạp lại các công cụ biên dịch nặng nề.

Quá trình biên dịch sản phẩm cũng đồng thời phân tích cây định tuyến thành hai nhóm route cơ bản:
- Route tĩnh với ký hiệu hình tròn rỗng thể hiện trang được kết xuất trước thành tệp HTML và JSON tĩnh ngay tại thời điểm build, giúp phản hồi ngay lập tức cho người dùng từ bộ nhớ đệm máy chủ hoặc mạng phân phối nội dung.
- Route động với ký hiệu chữ f nghiêng thể hiện các trang hoặc điểm cuối API cần được máy chủ tính toán và render theo yêu cầu tại thời điểm phát sinh truy cập từ máy khách.

### Mã nguồn

Cấu hình các câu lệnh thực thi và phiên bản công cụ được định nghĩa trong tệp package.json của dự án:

```json
{
  "name": "travel-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.3.5",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

Cấu hình kiểm tra kiểu dữ liệu nghiêm ngặt được thiết lập trong tệp tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

Kiểu dữ liệu địa điểm du lịch được khai báo tường minh trong tệp app/(tourist)/places/components/types.ts để định hình khuôn mẫu cho toàn bộ hệ thống:

```typescript
export type Place = {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  lat: number;
  lng: number;
  category: string;
  openTime: string;
  price: string;
  experience: string;
  province: number;
};
```

Câu lệnh thực hiện quy trình biên dịch toàn bộ hệ thống từ cửa sổ dòng lệnh:

```bash
npm run build
```

### Giải thích

Kiểm soát chất lượng bằng TypeScript giúp ứng dụng du lịch tránh được tình trạng xung đột dữ liệu giữa các phân hệ. Bằng việc kích hoạt thuộc tính strict trong tệp cấu hình tsconfig.json, trình biên dịch yêu cầu mọi biến số, tham số hàm và đối tượng truyền qua props đều phải được định kiểu rõ ràng. Đối với đối tượng Place, các thuộc tính tọa độ lat và lng bắt buộc phải mang kiểu dữ liệu số, trong khi các thuộc tính định danh như id hay slug phải là chuỗi văn bản. Nếu một thành phần giao diện cố tình truy xuất vào một trường không tồn tại hoặc truyền sai kiểu dữ liệu, tiến trình kiểm tra mã nguồn sẽ báo lỗi ngay lập tức và chặn đứng quá trình đóng gói. Việc phát hiện lỗi ngay trong giai đoạn biên dịch giúp tiết kiệm đáng kể thời gian gỡ lỗi và đảm bảo tính ổn định khi chạy trên trình duyệt người dùng.

Trình đóng gói Turbopack trên phiên bản Next.js 16 mang lại bước nhảy vọt về tốc độ phản hồi trong suốt chu kỳ lập trình. Do được biên dịch bằng ngôn ngữ Rust với khả năng tối ưu hóa bộ nhớ cấp thấp, Turbopack loại bỏ hoàn toàn độ trễ thường gặp của các công cụ đóng gói dựa trên nền tảng JavaScript trước đây. Trong chế độ phát triển, Turbopack chỉ phân tích cú pháp của đúng những tệp tin phục vụ cho trang web đang được lập trình viên mở trên trình duyệt. Khi lập trình viên sửa đổi một dòng mã giao diện hoặc logic điều hướng, Turbopack áp dụng cơ chế Turbo Engine để xác định đúng phần chênh lệch nhỏ nhất, sau đó thay thế trực tiếp vào luồng thực thi của trình duyệt mà không làm mất đi trạng thái tương tác hiện thời.

Sự phân tách giữa ba lệnh next dev, next build và next start thể hiện quy trình đưa mã nguồn từ bàn làm việc của lập trình viên ra hệ thống thực tế. Lệnh next dev tập trung vào tính tương tác và tốc độ phản hồi nhanh, ưu tiên khả năng gỡ lỗi trực tiếp mà không thực hiện các bước tối ưu hóa sâu. Ngược lại, lệnh next build là bước kiểm tra nghiêm ngặt nhất của toàn bộ dự án. Khi thực thi build, hệ thống sẽ đồng thời khởi chạy tiến trình kiểm tra kiểu TypeScript trên toàn bộ cây thư mục, nếu có bất kỳ sai sót nào dù là nhỏ nhất thì tiến trình sẽ dừng lại ngay lập tức. Sau khi vượt qua bước kiểm tra kiểu, Next.js tiến hành thu gọn mã nguồn, tách nhỏ các gói JavaScript dùng chung và chạy thử việc thu thập dữ liệu để xác định chính xác tính chất tĩnh hoặc động của từng route. Cuối cùng, lệnh next start nhận gói mã đã được đóng gói hoàn chỉnh trong thư mục đầu ra để phục vụ các yêu cầu truy cập thực tế với mức tiêu thụ bộ nhớ thấp nhất và độ trễ tối thiểu, tách rời hoàn toàn khỏi môi trường phát triển ban đầu.

### Kết quả

Kết quả ghi nhận từ cửa sổ dòng lệnh khi chạy lệnh npm run build trong dự án travel-website:

```text
> travel-website@0.1.0 build
> next build

▲ Next.js 16.3.5 (Turbopack)
- Environments: .env.local
✓ Running next.config.ts took 57ms

  Creating an optimized production build ...
✓ Compiled successfully in 1216ms
  Running TypeScript ...
  Finished TypeScript in 6.0s ...
  Collecting page data using 11 workers ...
✓ Generating static pages using 11 workers (12/12) in 980ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /api/places
├ ƒ /api/vietmap/administrative
├ ƒ /api/vietmap/autocomplete
├ ƒ /api/vietmap/place
├ ƒ /api/vietmap/reverse
├ ƒ /api/vietmap/route
├ ○ /map
├ ○ /places
└ ƒ /places/[slug]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Bảng tổng hợp kết quả build trên phản ánh chi tiết cách Next.js 16 phân loại bản chất thực thi của từng tuyến đường trong đồ án:

Nhóm route tĩnh mang ký hiệu hình tròn rỗng bao gồm các tuyến đường:
- Tuyến đường /map và /places được biên dịch dưới dạng tĩnh vì các tệp cấp trang tương ứng không phụ thuộc vào dữ liệu yêu cầu theo thời gian thực như thông tin xác thực, tiêu đề HTTP hoặc các tham số truy vấn tìm kiếm lúc người dùng gửi yêu cầu. Khung giao diện của các trang này được kết xuất sẵn thành tài nguyên tĩnh duy nhất trong giai đoạn build, sẵn sàng phản hồi ngay lập tức cho người dùng mà không cần tiêu tốn tài nguyên tính toán của máy chủ ở mỗi lượt truy cập.
- Tuyến đường /_not-found cũng được xuất bản dưới dạng tài nguyên tĩnh nhằm đảm bảo giao diện thông báo lỗi 404 luôn phản hồi tức thì với độ trễ thấp nhất khi người dùng nhập sai địa chỉ URL.

Nhóm route động mang ký hiệu chữ f nghiêng bao gồm các tuyến đường:
- Tuyến đường / trang chủ được hệ thống nhận diện là route động do thành phần cấp trang thực hiện gọi dữ liệu danh sách địa điểm và hành trình gợi ý với tùy chọn bộ đệm không lưu trữ no-store. Cấu hình này yêu cầu máy chủ phải tiến hành truy vấn lại nguồn dữ liệu mới nhất mỗi khi có yêu cầu truy cập từ du khách.
- Tuyến đường /places/[slug] là route chi tiết địa điểm sử dụng phân đoạn động Dynamic Segment. Giá trị slug phụ thuộc hoàn toàn vào địa điểm mà người dùng lựa chọn trên thanh địa chỉ, do đó máy chủ phải tiếp nhận giá trị này khi có yêu cầu phát sinh rồi mới thực thi tìm kiếm thông tin tương ứng để kết xuất trang.
- Nhóm các tuyến đường giao tiếp máy chủ /api/places và /api/vietmap/* đều được thiết lập là route động. Các điểm cuối này vận hành dưới dạng Route Handler tiếp nhận trực tiếp các yêu cầu HTTP theo thời gian thực để truy xuất cơ sở dữ liệu nội bộ và hoạt động như một trạm trung chuyển ủy quyền bảo mật thông tin với máy chủ đám mây của Vietmap.

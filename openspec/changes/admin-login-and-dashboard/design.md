## Context

Dự án Portfolio hiện tại được phát triển bằng Next.js (App Router), TypeScript và Tailwind CSS. Dữ liệu blog đang được lưu trữ tĩnh dưới dạng các file Markdown (`.md`) trong thư mục `src/data/posts` và được đọc bằng thư viện `gray-matter`. Chưa có hệ thống cơ sở dữ liệu động, hệ thống quản trị, xác thực người dùng cũng như tính năng đếm và theo dõi lượt xem (views) của từng bài viết.

Yêu cầu đặt ra là bổ sung các tính năng này một cách tối giản nhưng bảo mật và trực quan, không cần cài đặt thêm hệ quản trị cơ sở dữ liệu phức tạp.

## Goals / Non-Goals

**Goals:**
- Triển khai trang đăng nhập Admin tại `/admin/login` không quá cầu kỳ nhưng vẫn chỉn chu.
- Xác thực Admin thông qua tài khoản mặc định: username là `admin` và mật khẩu là `loc123@@` (được so sánh bằng mã băm SHA-256: `f0e1d03486839fc5047e91376fa023d1c3b7da90c7bb98db09dbf705e0b5fde5`).
- Sử dụng cơ chế session cookie bảo mật (`HttpOnly`, `SameSite=Lax`) được ký bằng mã băm SHA-256 kèm theo một khóa bí mật (Secret Key) để tránh giả mạo.
- Xây dựng trang Admin Dashboard tại `/admin/dashboard` có giao diện cực kỳ hiện đại, chuyên nghiệp, bóng bẩy (Rich Aesthetics, Glassmorphism, Harmonious Dark/Light Palette) hiển thị:
  - Thống kê tổng quan: Tổng số bài viết, Tổng số lượt xem.
  - Danh sách bài viết hiện tại: Tiêu đề, Ngày đăng, Tags, Số lượt xem.
  - Nút Đăng xuất.
  - Giao diện thêm bài viết mới (Form nhập thông tin và soạn thảo nội dung bài viết dưới dạng Markdown).
- Triển khai API `/api/posts/create` để lưu bài viết mới thành file Markdown vật lý trong `src/data/posts`.
- Triển khai API `/api/posts/views` và cơ chế lưu trữ lượt xem cục bộ bằng file JSON `src/data/post-views.json` để theo dõi và tăng lượt xem khi người dùng truy cập bài viết.

**Non-Goals:**
- Tích hợp các hệ cơ sở dữ liệu bên ngoài (PostgreSQL, MongoDB, v.v.). Toàn bộ dữ liệu vẫn được lưu trữ dạng file cục bộ (Markdown + JSON) để duy trì tính gọn nhẹ của Portfolio.
- Hỗ trợ đăng ký tài khoản mới hoặc quản lý nhiều tài khoản admin (chỉ duy nhất tài khoản mặc định của loc).
- Trình chỉnh sửa Markdown WYSIWYG phức tạp (chỉ cần Textarea hỗ trợ preview hoặc hướng dẫn cơ bản).

## Decisions

### 1. Cơ chế lưu trữ số lượt xem (Page Views)
- **Lựa chọn**: Sử dụng một file JSON cục bộ `src/data/post-views.json` lưu trữ dưới dạng key-value: `{ [slug: string]: number }`.
- **Lý do**: Cực kỳ gọn nhẹ, dễ dàng đọc/ghi bằng API Node.js `fs` mà không cần cấu hình database hay các dịch vụ bên thứ ba. Phù hợp hoàn hảo với kiến trúc static-site/hybrid của portfolio.
- **Giải pháp thay thế**: Sử dụng Redis hay Supabase, nhưng sẽ quá phức tạp và làm tăng chi phí vận hành cho một trang portfolio cá nhân.

### 2. Xác thực Admin và Phiên làm việc (Session Management)
- **Lựa chọn**: Sử dụng HTTP-Only Cookie chứa Token dạng `admin:<timestamp>:<signature>` ký bằng SHA-256 HMAC với `SECRET_KEY`.
- **Lý do**: Cookie HTTP-Only giúp chống lại các cuộc tấn công XSS. Token có chữ ký signature giúp ngăn chặn việc giả mạo phía Client mà không cần database để lưu session ID. Next.js API Routes dễ dàng đọc và kiểm tra cookie này ở phía Server.
- **Giải pháp thay thế**: JWT (Json Web Token) sử dụng thư viện `jose` hoặc `jsonwebtoken`. Tuy nhiên việc tự ký token bằng `crypto` tích hợp sẵn trong Node.js sẽ loại bỏ hoàn toàn các vấn đề xung quanh việc cài đặt thêm package bên thứ ba và hoạt động mượt mà trên môi trường Edge/Serverless của Next.js.

### 3. Mã hóa Mật khẩu Admin
- **Lựa chọn**: So sánh mật khẩu bằng cách băm chuỗi password nhận được bằng thuật toán SHA-256 của Node.js `crypto` và so sánh trực tiếp với chuỗi băm tĩnh `f0e1d03486839fc5047e91376fa023d1c3b7da90c7bb98db09dbf705e0b5fde5`.
- **Lý do**: Đảm bảo mật khẩu không bao giờ được lưu dưới dạng bản rõ trong mã nguồn. Tránh phụ thuộc vào thư viện `bcrypt` (thường gây lỗi build native trên môi trường Windows).

### 4. Lưu trữ bài viết mới
- **Lựa chọn**: Khi Admin thêm bài viết thành công, API phía Server sẽ tự động tạo slug từ tiêu đề bài viết và ghi file Markdown mới tại `src/data/posts/[slug].md` với frontmatter chuẩn của dự án.
- **Lý do**: Đồng bộ hoàn toàn với cơ chế tải bài viết hiện có của Portfolio (dùng `gray-matter` quét thư mục `src/data/posts`). Bài viết mới xuất hiện ngay lập tức trên trang danh sách blog của người dùng mà không cần build lại.

## Risks / Trade-offs

- **[Risk] Xung đột ghi file JSON lượt xem (Concurrent Writes)** → Khi nhiều người dùng truy cập đồng thời, việc đọc-ghi file `post-views.json` bằng `fs.writeFileSync` có thể gây mất dữ liệu lượt xem hoặc lỗi ghi file.
  - *Mitigation*: Áp dụng cơ chế khóa file đơn giản hoặc thực hiện đọc ghi bất đồng bộ có kiểm soát. Với lượng truy cập thông thường của một portfolio cá nhân, tần suất ghi đồng thời cực kỳ thấp nên ảnh hưởng không đáng kể.
- **[Risk] Lộ Secret Key ký session cookie** → Nếu mã nguồn bị công khai trên GitHub, signature có thể bị giả mạo.
  - *Mitigation*: Sử dụng biến môi trường `ADMIN_SECRET` trong production. Nếu biến môi trường chưa được thiết lập, hệ thống sẽ tự động fallback về một chuỗi ngẫu nhiên được sinh ra khi khởi tạo server hoặc một secret key mặc định.
- **[Risk] Nhập sai định dạng file Markdown làm hỏng trang blog** → Admin nhập nội dung gây lỗi cú pháp frontmatter hoặc nội dung không hợp lệ.
  - *Mitigation*: Server sẽ tự động tạo cấu trúc frontmatter chuẩn dựa trên các trường dữ liệu tách biệt (Title, Description, Tags, CoverImage) và chỉ cho phép Admin nhập nội dung phần Markdown thân bài viết.

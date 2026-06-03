## Context

Hệ thống Next.js 14 hiện tại chưa có cơ chế kiểm soát quyền truy cập tập trung (Middleware). Việc xác thực phiên admin được thực hiện thủ công tại từng trang hoặc API. Chúng ta cần triển khai Next.js Middleware tập trung để bảo vệ các trang admin và API sửa đổi dữ liệu. Đồng thời, cấu hình cơ sở dữ liệu MongoDB chạy trên Docker và helper kết nối để lưu trữ dữ liệu bền vững.

## Goals / Non-Goals

**Goals:**
- Thiết lập Next.js Middleware tại `src/middleware.ts` để chặn truy cập trái phép vào `/admin/*` (trừ `/admin/login`) và các API Route thay đổi dữ liệu (`POST`, `PUT`, `DELETE` cho bài viết, diễn đàn).
- Xác định rõ cấu trúc cơ sở dữ liệu MongoDB và kết nối thông qua helper `src/lib/mongodb.ts`.
- Đảm bảo giao diện trang đăng nhập sử dụng màu sắc pastel nhẹ nhàng, thiết kế thân thiện, tương thích tốt trên mobile.
- Enforce: Không sử dụng bất kỳ thư viện dịch đa ngôn ngữ (i18n) nào cho các phần thông báo lỗi và giao diện.

**Non-Goals:**
- Tích hợp các nhà cung cấp xác thực bên ngoài (NextAuth, Auth0).
- Hỗ trợ nhiều vai trò người dùng (chỉ có duy nhất tài khoản admin).
- Thay đổi cấu trúc cơ sở dữ liệu sang SQL hay sử dụng các ORM cồng kềnh (Prisma/Mongoose).

## Decisions

### 1. Centralized Middleware (`src/middleware.ts`)
- **Lý do**: Sử dụng Next.js Middleware để chặn các yêu cầu ngay từ tầng định tuyến trước khi render trang hoặc chạy API handler. Điều này giúp code gọn gàng, tránh lặp lại logic check session ở từng file.
- **Giải pháp thay thế**: Check session thủ công ở từng Server Component và API route (cách làm cũ, dễ bỏ sót).

### 2. Sử dụng MongoDB thuần (`mongodb` package)
- **Lý do**: Driver chính thức nhẹ nhàng, tương thích hoàn hảo với JSON data hiện có của dự án.
- **Giải pháp thay thế**: Prisma (đòi hỏi schema phức tạp và compile nhị phân), Mongoose (nặng và không cần thiết cho dự án nhỏ).

### 3. File & Component Structure

Dưới đây là cấu trúc các file liên quan:
- **`src/middleware.ts`**: Middleware kiểm tra cookie `admin_session`, giải mã chữ ký HMAC và chuyển hướng/chặn request nếu không hợp lệ.
- **`src/lib/auth.ts`**: Thư viện chứa logic băm mật khẩu bằng SHA-256 và tạo/verify token ký số.
- **`src/lib/mongodb.ts`**: Module kết nối MongoDB tái sử dụng connection promise để tránh cạn kiệt pool trong quá trình dev (HMR).
- **`src/app/admin/login/page.tsx` (Client Component)**: Trang đăng nhập giao diện pastel nhẹ nhàng.
- **`src/app/admin/dashboard/page.tsx` (Server Component)**: Bảng điều khiển quản trị viên.

### 4. Giao diện & Responsive
- **Tone màu**: Sử dụng tone pastel nhẹ, nền sáng (hoặc kết hợp nhẹ nhàng) thay vì các bảng màu tối neon.
- **Mobile-first**: Form đăng nhập tối ưu cho màn hình nhỏ với padding hợp lý, khoảng cách giữa các input tối thiểu `1rem` và nút bấm có kích thước chạm tối thiểu `44px`.

## Risks / Trade-offs

- **[Risk]** Next.js Middleware chạy trên môi trường Edge Runtime nên một số module Node.js truyền thống có thể không được hỗ trợ đầy đủ.
  - *Mitigation*: Helper verify token trong `src/lib/auth.ts` sử dụng module `crypto` tiêu chuẩn của Node.js, vốn đã được Next.js hỗ trợ trong các phiên bản gần đây hoặc có thể thay thế bằng Web Crypto API nếu cần thiết.

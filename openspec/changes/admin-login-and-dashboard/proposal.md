## Why

Cung cấp giao diện quản trị Admin Dashboard trực quan cho chủ sở hữu portfolio để đăng nhập bảo mật, xem số lượt đọc (views) của từng bài viết, danh sách các bài viết hiện tại và dễ dàng soạn thảo/thêm bài viết mới trực tiếp trên web mà không cần thao tác qua Git hay chỉnh sửa file Markdown thủ công.

## What Changes

- **Trang Đăng nhập Admin (`/admin/login`)**: Cho phép quản trị viên đăng nhập bằng tài khoản `admin` và mật khẩu `loc123@@` (sử dụng mật khẩu đã được băm bảo mật để so sánh).
- **Trang Dashboard Admin (`/admin/dashboard`)**: Trang quản lý hiển thị danh sách toàn bộ các bài viết, ngày đăng, số lượt xem (views) tương ứng và nút điều hướng để tạo bài viết mới.
- **Tính năng thêm bài viết mới**: Cung cấp biểu mẫu (form) nhập Tiêu đề, Mô tả, Ảnh bìa, Tags và Nội dung bài viết (hỗ trợ định dạng Markdown). Bài viết mới sẽ được ghi trực tiếp vào thư mục `src/data/posts/` dưới dạng file `.md`.
- **Hệ thống theo dõi lượt xem (Page Views)**: Tự động ghi nhận lượt xem khi người dùng truy cập trang chi tiết bài viết, lưu trữ an toàn trong một file JSON cục bộ `src/data/post-views.json` và hiển thị trên Dashboard.
- **API Routes phục vụ các chức năng**:
  - `/api/admin/login`, `/api/admin/logout`, `/api/admin/session` để quản lý phiên đăng nhập qua HTTP-only cookie.
  - `/api/posts/create` để lưu bài viết mới.
  - `/api/posts/views` để tăng và lấy lượt xem của các bài viết.

## Capabilities

### New Capabilities

- `admin-auth`: Quản lý xác thực và phiên làm việc của Admin bằng tài khoản mặc định thông qua cookie bảo mật.
- `admin-dashboard`: Giao diện quản lý danh sách bài viết hiện tại, tổng hợp lượt xem trực quan và điều khiển.
- `blog-creation`: Soạn thảo và thêm bài viết mới trực tiếp, tự động lưu thành file Markdown cục bộ đúng chuẩn của dự án.
- `post-views-tracking`: Theo dõi lượt xem của từng bài viết và cập nhật mỗi khi có người đọc bài viết.

### Modified Capabilities

(Không có thay đổi về mặt yêu cầu của các tính năng cũ)

## Impact

- **Các route mới**: `/admin/login`, `/admin/dashboard`, `/api/admin/login`, `/api/admin/logout`, `/api/admin/session`, `/api/posts/create`, `/api/posts/views`.
- **Cơ sở dữ liệu cục bộ**: File `src/data/post-views.json` để lưu trữ số lượng lượt xem của từng bài viết theo slug.
- **Các thành phần hiện tại**: Cập nhật trang chi tiết bài viết (`src/app/blog/[slug]/page.tsx` hoặc Component liên quan) để gọi API `/api/posts/views` khi có người dùng đọc bài nhằm cập nhật lượt xem.
- **Bảo mật**: Sử dụng cookie bảo mật (`HttpOnly`, `SameSite=Lax`, `Secure` ở production) để duy trì trạng thái đăng nhập của Admin. Mật khẩu mặc định `loc123@@` sẽ được lưu dưới dạng chuỗi băm để so sánh trong API xác thực.

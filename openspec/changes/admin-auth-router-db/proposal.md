## Why

Hiện tại, hệ thống bảo mật cho trang quản trị (Admin) của portfolio đang được thực hiện thủ công tại từng trang hoặc API endpoint riêng lẻ mà chưa có cơ chế kiểm soát tập trung ở cấp độ định tuyến (router-level middleware). Đồng thời, việc lưu trữ và xác thực phiên đăng nhập qua cookie cần được chuẩn hóa, kết hợp với việc xác định và cấu hình rõ ràng cơ sở dữ liệu MongoDB để lưu trữ thông tin lâu dài, an toàn thay vì ghi file JSON cục bộ.

## Non-Goals

- Không tích hợp các dịch vụ xác thực bên thứ ba phức tạp (như Auth0, NextAuth, Firebase Auth).
- Không thêm các boilerplate đa ngôn ngữ (localization/i18n) cho trang quản trị; tất cả thông báo lỗi và nhãn sẽ sử dụng chuỗi tiếng Việt hoặc tiếng Anh trực tiếp trong code.
- Không thay đổi thiết kế giao diện sang phong cách glassmorphism neon tối mà giữ phong cách nhẹ nhàng, pastel thanh lịch phù hợp với định hướng thiết kế mới.

## What Changes

- **Tập trung hóa bảo mật bằng Middleware**: Xây dựng Next.js Middleware (`src/middleware.ts`) để bảo vệ các tuyến đường `/admin/*` (ngoại trừ `/admin/login`) và các API Route nhạy cảm (như `/api/posts/*`, `/api/forum/*` đối với các phương thức sửa đổi dữ liệu POST/PUT/DELETE).
- **Chuẩn hóa API xác thực**: API `/api/admin/login`, `/api/admin/logout`, và `/api/admin/session` sẽ được kiểm tra và tối ưu hóa để đảm bảo cookie hoạt động đồng bộ với Middleware.
- **Xác định và tích hợp Database MongoDB**: Khởi chạy MongoDB container qua `docker-compose.yml`, cấu hình kết nối thông qua helper `src/lib/mongodb.ts`, và đảm bảo toàn bộ dữ liệu phiên (nếu cần mở rộng) hoặc dữ liệu hệ thống (lượt xem, bài viết, bình luận, kênh thảo luận) được lưu trữ an toàn trong MongoDB.

## Capabilities

### New Capabilities
- `admin-router-protection`: Cấp quyền và bảo vệ tập trung các tuyến đường quản trị và API endpoint bằng Next.js Middleware.
- `mongodb-database-definition`: Cấu hình MongoDB làm cơ sở dữ liệu chính để lưu trữ dữ liệu động (views, comments, channels, topics, replies).

### Modified Capabilities
- `admin-auth`: Thay đổi cơ chế xác thực để cookie phiên hoạt động mượt mà với Middleware và có cơ chế hết hạn an toàn.

## Impact

- **Middleware**: Thêm file `src/middleware.ts` ở thư mục nguồn.
- **API Routes**: Các API Route `/api/posts/*` và `/api/forum/*` sẽ không cần kiểm tra token thủ công ở từng file đối với các phương thức bị chặn, giúp tối giản code.
- **Cơ sở dữ liệu**: Sử dụng MongoDB làm nguồn dữ liệu chính cho views, comments, channels, topics, replies. Yêu cầu chạy MongoDB container.

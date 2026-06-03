## 1. Database Setup

- [ ] 1.1 Khởi chạy môi trường cơ sở dữ liệu MongoDB bằng Docker Compose (`docker-compose up -d`) và kiểm tra cổng 27017
- [ ] 1.2 Xác thực file helper kết nối `src/lib/mongodb.ts` hoạt động đúng đắn và load được biến môi trường `MONGODB_URI`

## 2. Middleware & Router Protection

- [ ] 2.1 Viết file Next.js Middleware tại `src/middleware.ts` để chặn truy cập trái phép vào `/admin/*` (trừ `/admin/login`) và các API POST/PUT/DELETE
- [ ] 2.2 Viết test nhỏ hoặc kiểm tra thủ công việc chuyển hướng sang `/admin/login` khi truy cập trang dashboard mà không có cookie

## 3. Clean up & Refactoring

- [ ] 3.1 Loại bỏ các đoạn check session thủ công trùng lặp tại `/admin/dashboard/page.tsx`
- [ ] 3.2 Tối giản hóa code tại các route API (`/api/posts/create`, `/api/posts/delete`, `/api/forum/channels`) bằng cách loại bỏ check session thủ công vì đã có middleware bảo vệ

## 4. Verification

- [ ] 4.1 Chạy biên dịch dự án bằng lệnh `npm run build` và kiểm tra lỗi kiểu dữ liệu TypeScript
- [ ] 4.2 Chạy linter bằng lệnh `npm run lint` để đảm bảo code sạch sẽ và tuân thủ các quy tắc dự án

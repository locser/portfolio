- [x] Khởi chạy và kiểm tra MongoDB cục bộ
  - [x] Tạo file `docker-compose.yml` ở thư mục gốc của dự án.
  - [x] Thêm biến môi trường `MONGODB_URI` vào file `.env`.
  - [x] Khởi động Docker container MongoDB: `docker compose up -d`.

- [x] Cài đặt thư viện và thiết lập Connection Helper
  - [x] Cài đặt package `mongodb`: `npm install mongodb`.
  - [x] Tạo helper kết nối `src/lib/mongodb.ts`.

- [x] Viết và chạy Script di chuyển dữ liệu (Migration Script)
  - [x] Tạo script di chuyển `scripts/migrate-to-mongo.js` (chạy trực tiếp bằng Node).
  - [x] Triển khai logic đọc các file JSON cục bộ và ghi vào MongoDB.
  - [x] Chạy script migration để chuyển dữ liệu hiện có lên MongoDB cục bộ.


- [x] Cập nhật các API Routes & Services sang dùng MongoDB
  - [x] Cập nhật API Views bài viết: [route.ts](file:///c:/ai-projects/my-porfolio/portfolio/src/app/api/posts/views/route.ts)
  - [x] Cập nhật API Bình luận bài viết: [route.ts](file:///c:/ai-projects/my-porfolio/portfolio/src/app/api/posts/comments/route.ts)
  - [x] Cập nhật logic quản lý diễn đàn: sửa các hàm trong [forum.ts](file:///c:/ai-projects/my-porfolio/portfolio/src/lib/forum.ts) để gọi trực tiếp tới MongoDB thay vì đọc tệp JSON.
  - [x] Cập nhật các API liên quan trong `/api/forum/...` nếu cần thiết.

- [x] Kiểm thử và xác thực
  - [x] Kiểm tra hiển thị lượt xem bài viết trên trang blog.
  - [x] Kiểm tra tạo bình luận bài viết mới.
  - [x] Kiểm tra hoạt động của diễn đàn (tạo chủ đề, bình luận, vote, đếm số lượt xem).
  - [x] Kiểm tra linter và build hệ thống: `npm run lint && npm run build`.


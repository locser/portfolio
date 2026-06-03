## Why

Hiện tại, dự án đang lưu trữ các thực thể động (Bình luận bài viết, Kênh thảo luận diễn đàn, Chủ đề diễn đàn, Phản hồi chủ đề, Lượt xem bài viết) dưới dạng các file JSON cục bộ (`post-views.json`, `post-comments.json`, `channels.json`, `topics.json`, `replies.json`). Cách tiếp cận này có nguy cơ mất dữ liệu cao khi deploy hoặc cập nhật ứng dụng (đặc biệt là trên các môi trường không duy trì trạng thái ổ đĩa lâu dài như Vercel, Heroku) và dễ xảy ra tranh chấp đọc-ghi (race conditions) khi có nhiều truy cập đồng thời.

Chúng ta cần chuyển đổi các thực thể này sang lưu trữ trong cơ sở dữ liệu MongoDB chạy trên Docker cục bộ để đảm bảo tính toàn vẹn dữ liệu, bền vững lâu dài và dễ dàng mở rộng.

## What Changes

- **Hạ tầng Docker**: Khởi chạy MongoDB container thông qua `docker-compose.yml` để làm môi trường cơ sở dữ liệu cục bộ.
- **Cấu hình môi trường**: Bổ sung `MONGODB_URI` vào file `.env`.
- **Kết nối MongoDB**: Tạo helper `src/lib/mongodb.ts` để kết nối Next.js với MongoDB sử dụng driver chính thức `mongodb`.
- **API Routes**: Cập nhật các API endpoints hiện có để chuyển từ đọc/ghi tệp JSON sang truy vấn và cập nhật trực tiếp trên MongoDB:
  - API Lượt xem bài viết (`/api/posts/views`)
  - API Bình luận bài viết (`/api/posts/comments`)
  - API Kênh thảo luận (`/api/forum/channels`)
  - API Chủ đề diễn đàn (`/api/forum/topics`, `/api/forum/topics/detail`, `/api/forum/topics/vote`)
  - API Phản hồi diễn đàn (`/api/forum/replies`)
- **Script di chuyển dữ liệu (Migration Script)**: Viết script `scripts/migrate-to-mongo.ts` đọc dữ liệu từ các file JSON hiện có và chèn (Upsert) vào các collection tương ứng trong MongoDB để đảm bảo không mất dữ liệu cũ.

## Capabilities

### New Capabilities

- `mongodb-integration`: Cấu hình kết nối và các hàm tiện ích để giao tiếp Next.js với cơ sở dữ liệu MongoDB.
- `data-migration-to-mongo`: Script di chuyển toàn bộ dữ liệu lịch sử từ JSON files sang các collections trong MongoDB.

### Modified Capabilities

- `post-views-tracking`: Đọc và cập nhật lượt xem bài viết thông qua MongoDB collection `post_views`.
- `blog-comments`: Tạo, truy xuất và quản lý bình luận qua MongoDB collection `post_comments`.
- `forum-channels`: Quản lý các kênh diễn đàn qua MongoDB collection `forum_channels`.
- `forum-topics`: Quản lý các chủ đề và đếm tương tác qua MongoDB collection `forum_topics`.
- `forum-replies`: Tạo và hiển thị các phản hồi của chủ đề diễn đàn qua MongoDB collection `forum_replies`.

## Impact

- **Môi trường**: Cần cài đặt và chạy Docker Desktop để chạy container MongoDB.
- **Mã nguồn**: Thêm file `docker-compose.yml`, `src/lib/mongodb.ts`, `scripts/migrate-to-mongo.ts`.
- **API Routes**: Thay đổi logic bên trong các API Routes để loại bỏ các thư viện `fs` đọc ghi file và thay bằng truy vấn MongoDB.
- **Tính bền vững (Persistence)**: Tránh mất mát dữ liệu bình luận hay lượt xem của người dùng khi deploy ứng dụng lên production.

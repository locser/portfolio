## Why

Người dùng muốn tiếp tục phát triển trang web cá nhân (được xây dựng trên Next.js 14, React, TailwindCSS) để chia sẻ về bản thân, các trải nghiệm cuộc sống, sở thích, sự nghiệp và công nghệ. Trang web cần hướng tới phong cách tối giản, giản dị, không sử dụng quá nhiều font chữ hay màu sắc, và có tính năng blog cho phép người đọc xem nội dung hoàn toàn miễn phí mà không cần đăng nhập.

## What Changes

- **Thiết kế tối giản (Minimalist UI/UX)**: Tinh giản giao diện hiện tại, sử dụng hệ màu đơn sắc tinh tế, giảm số lượng font chữ, tập trung vào tính dễ đọc và bố cục gọn gàng. Hỗ trợ đầy đủ Light/Dark theme. Đảm bảo trải nghiệm lướt web (scrolling) cực kỳ mượt mà (60 FPS) và tối ưu lưu trữ phía client (không lưu trữ dư thừa dữ liệu cồng kềnh).
- **Tính năng Blog hoàn thiện (Blog Engine)**: Xây dựng hệ thống blog tĩnh dựa trên Markdown/MDX nội bộ (Local Markdown) giúp người dùng dễ dàng viết và quản lý bài đăng mà không cần cơ sở dữ liệu phức tạp. Người đọc có thể truy cập hoàn toàn miễn phí mà không cần đăng nhập.
- **Chức năng chi tiết cho Blog**:
  - Danh sách bài viết có phân trang hoặc cuộn vô hạn.
  - Tìm kiếm bài viết theo từ khóa và lọc theo tags/categories.
  - Hiển thị bài viết chi tiết với định dạng Markdown chuẩn, giao diện đọc thân thiện (Typography tốt).
  - Tích hợp tính năng ước tính thời gian đọc (Reading Time) và mục lục (Table of Contents).
  - Tích hợp gợi ý bài viết liên quan (Suggested posts) và thanh điều hướng bài tiếp theo/bài trước đó (Next/Previous Navigation) mượt mà ở cuối mỗi bài viết.
- **Chia sẻ thông tin cá nhân**: Cập nhật trang About Me, Portfolio (Showcase các dự án cá nhân) và Career Timeline đơn giản nhưng tinh tế.
- **Sprint/Phase Development**: Lập kế hoạch phát triển cụ thể qua các Sprint để người dùng dễ dàng theo dõi và thực hiện.

## Capabilities

### New Capabilities
- `blog-engine`: Quản lý và hiển thị bài viết qua Markdown/MDX nội bộ, hỗ trợ lọc, tìm kiếm, hiển thị nội dung chất lượng cao.
- `minimalist-ui`: Cập nhật hệ thống giao diện tối giản (Color palette giới hạn, typography gọn gàng, hiệu ứng chuyển động mượt mà nhưng tinh giản).
- `portfolio-timeline`: Trang thông tin cá nhân và timeline sự nghiệp/cuộc sống của tác giả một cách giản dị, đẹp mắt.

### Modified Capabilities
*Không có capability hiện tại nào bị thay đổi về yêu cầu.*

## Impact

- **Tác động đến codebase hiện tại**:
  - Cập nhật cấu trúc thư mục trong `src/app` để thêm các trang `/blog`, `/blog/[slug]`, `/about`.
  - Cài đặt thêm các package hỗ trợ Markdown: `gray-matter`, `remark`, `rehype` (hoặc `next-mdx-remote`).
  - Sửa đổi file cấu hình CSS và Tailwind (`tailwind.config.ts`, `src/app/globals.css`) để áp dụng giao diện tối giản mới.
- **Tác động đến quy trình làm việc**:
  - Bài viết mới sẽ được thêm đơn giản bằng cách tạo file `.md` hoặc `.mdx` trong thư mục bài viết mà không cần backend hay database.

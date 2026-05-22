## 1. Phase 1: Setup & Design System Tối Giản (Sprint 1)

- [x] 1.1 Khởi tạo lại thiết lập Typography và Màu sắc tối giản trong `tailwind.config.ts` và `src/app/globals.css` (chỉ dùng font `Inter`, bảng màu Monochromatic xám/đen/trắng tinh tế).
- [x] 1.2 Cài đặt các thư viện bổ trợ cho Markdown: `npm install gray-matter next-mdx-remote rehype-highlight` (hoặc các package tương đương).
- [x] 1.3 Tạo cấu trúc thư mục chứa các file Markdown cho blog tại `src/data/posts` và thêm 2 bài viết mẫu (`.md`) có đầy đủ thông tin front-matter.
- [x] 1.4 Xây dựng file tiện ích `src/lib/markdown.ts` để đọc danh sách file, phân tích cú pháp front-matter và lấy nội dung chi tiết của từng bài viết có try-catch chống sập trang.
- [x] 1.5 Bổ sung hàm logic trong `src/lib/markdown.ts` để tìm kiếm bài viết liên quan (Suggested Posts) dựa trên số lượng tag trùng khớp và tìm các bài viết liền kề (Next/Prev Posts) sắp xếp theo thời gian đăng.

## 2. Phase 2: Xây dựng Blog Engine & Render Bài Viết (Sprint 2)

- [x] 2.1 Tạo cấu trúc định tuyến cho blog tại `src/app/blog/page.tsx` (trang danh sách) và `src/app/blog/[slug]/page.tsx` (trang chi tiết).
- [x] 2.2 Triển khai render nội dung Markdown thành HTML chất lượng cao trên trang chi tiết sử dụng `next-mdx-remote` và tối ưu hóa CSS cho typography dễ đọc.
- [x] 2.3 Tích hợp tính năng tính toán thời gian đọc (Reading Time) và tự động tạo mục lục (Table of Contents) dựa trên các thẻ tiêu đề (H2, H3).
- [x] 2.4 Áp dụng thư viện highlight cú pháp code (như `rehype-highlight` hoặc `prism`) cho các block mã nguồn trong bài viết.
- [x] 2.5 Phát triển UI và tích hợp phần gợi ý bài viết liên quan (Suggested Posts) cùng liên kết chuyển nhanh bài trước/bài sau (Next/Prev Post Navigation) mượt mà ở cuối trang chi tiết `/blog/[slug]`.

## 3. Phase 3: Phát triển Tính Năng Tìm Kiếm, Lọc & Tương Tác Client-Side (Sprint 3)

- [x] 3.1 Phát triển thanh tìm kiếm theo thời gian thực (real-time client-side search) lọc bài viết theo tiêu đề và mô tả.
- [x] 3.2 Phát triển bộ lọc (filter) bài viết theo danh sách tag/category lấy từ front-matter của tất cả các bài viết.
- [x] 3.3 Tinh chỉnh nút chuyển đổi Light/Dark theme sử dụng `next-themes`, đảm bảo không bị hydration mismatch và chuyển đổi mượt mà.
- [x] 3.4 Thêm hiệu ứng chuyển động vi mô (micro-interactions) nhẹ nhàng với Framer Motion khi hover vào các thẻ bài viết (post cards) và khi chuyển đổi các trang.
- [x] 3.5 Tối ưu hóa hiệu năng cuộn trang 60 FPS mượt mà: sử dụng CSS `scroll-behavior: smooth`, tối ưu hóa component Image của Next.js, tinh chỉnh các Framer Motion properties sử dụng hardware acceleration (transform/opacity) và kiểm soát bộ nhớ client-side (không lưu cache dữ liệu dư thừa, giữ LocalStorage tối giản).

## 4. Phase 4: Hoàn Thiện About Me, Timeline & Showcase Dự Án (Sprint 4)

- [x] 4.1 Tạo trang `/about` để chia sẻ thông tin cá nhân chân thực, sở thích và triết lý sống.
- [x] 4.2 Xây dựng trục thời gian (timeline) sự nghiệp, học vấn và các dấu mốc cuộc sống theo tuyến tính thời gian một cách trực quan, tối giản trên trang `/about` hoặc trang chủ.
- [x] 4.3 Cập nhật phần Featured Projects hiển thị danh sách dự án nổi bật dạng thẻ tối giản có đầy đủ liên kết tới GitHub và Live Demo.
- [x] 4.4 Thực hiện kiểm thử toàn bộ các trang trên môi trường development, tối ưu hóa SEO (title, meta description cho từng trang) và kiểm tra khả năng responsive trên di động trước khi bàn giao.

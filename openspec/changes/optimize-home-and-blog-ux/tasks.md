## 1. Tối ưu hóa cấu trúc trang chủ (Home Page Optimization)

- [x] 1.1 Thay đổi thứ tự hiển thị các section tại `src/app/page.tsx`, di chuyển section `Blog` lên ngay phía dưới section `Projects` và đứng trước `Experience`.
- [x] 1.2 Cập nhật CSS/padding trong các component `src/components/Experience.tsx` và `src/components/TechStack.tsx` để giảm thiểu khoảng cách đệm trục Y và thu ngắn chiều dài cuộn trang chủ.

## 2. Hỗ trợ Light/Dark Mode cho trang danh sách Blog và chi tiết bài viết

- [x] 2.1 Cập nhật file `src/app/blog/BlogClient.tsx` để thay thế các class màu nền và màu chữ hardcode bằng các class phản hồi responsive của Tailwind (sử dụng tiền tố `dark:` tương thích với `next-themes`).
- [x] 2.2 Cập nhật file `src/app/blog/[slug]/page.tsx` và các component tùy chỉnh MDX (h2, h3, p, ul, ol, blockquote, pre, a) để hỗ trợ hiển thị màu nền, màu chữ và viền tương phản sắc nét trong cả hai chế độ sáng/tối.

## 3. Nâng cấp Sticky Header để phân biệt rõ khi cuộn trang (Header Distinction)

- [x] 3.1 Điều chỉnh các class màu nền, độ mờ (backdrop opacity) và thêm bóng đổ/viền rõ ràng hơn cho sticky Header tại `src/app/blog/BlogClient.tsx`.
- [x] 3.2 Điều chỉnh tương tự cho sticky Header tại `src/app/blog/[slug]/page.tsx`.

## 4. Hiển thị Tags bài viết ở đầu trang chi tiết (Blog Tags Integration)

- [x] 4.1 Chèn mã render mảng `post.tags` dưới dạng các badge/pill tinh tế, hỗ trợ cả 2 chế độ giao diện, ở phần đầu trang chi tiết bài viết `src/app/blog/[slug]/page.tsx` ngay phía bên dưới tiêu đề chính.

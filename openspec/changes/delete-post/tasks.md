## 1. Backend Implementation

- [x] 1.1 Xây dựng API Route `DELETE /api/posts/delete` tại `src/app/api/posts/delete/route.ts` thực hiện xác thực admin session
- [x] 1.2 Triển khai logic xóa file Markdown vật lý tại `src/data/posts/[slug].md` và xử lý trường hợp file không tồn tại
- [x] 1.3 Triển khai logic dọn dẹp và cập nhật file lượt xem cục bộ `src/data/post-views.json` bằng cách loại bỏ key `slug`
- [x] 1.4 Thử nghiệm API xóa bằng script test hoặc chạy các kịch bản test để kiểm tra mã trạng thái trả về (200, 401, 403, 404, 500)

## 2. Frontend Components

- [x] 2.1 Tạo Client Component `DeletePostButton` tại `src/components/DeletePostButton.tsx` hiển thị nút xóa bọc modal xác nhận bóng bẩy (Rich Aesthetics, Glassmorphism)
- [x] 2.2 Tích hợp modal xác nhận với các nút bấm "Hủy" và "Xác nhận", xử lý disable các nút khi đang gửi request xóa bài
- [x] 2.3 Thực hiện gọi fetch API `DELETE /api/posts/delete` khi admin bấm Xác nhận, xử lý Toast thông báo kết quả thành công/thất bại
- [x] 2.4 Cập nhật danh sách bài viết bằng Next.js `router.refresh()` sau khi xóa bài viết thành công

## 3. Integration and Dashboard Updates

- [x] 3.1 Cập nhật trang Admin Dashboard `/admin/dashboard` (`src/app/admin/dashboard/page.tsx`) để thêm cột Thao tác (Actions) vào bảng danh sách
- [x] 3.2 Nhúng Component `DeletePostButton` vào cột Thao tác cho từng dòng bài viết tương ứng
- [x] 3.3 Chạy thử nghiệm toàn bộ luồng: Đăng nhập -> Vào Dashboard -> Xóa thử 1 bài viết -> Xác nhận -> Xem danh sách tự động cập nhật và kiểm tra file `.md` cùng key trong file JSON biến mất
- [x] 3.4 Build và kiểm tra kiểu TypeScript (`npm run build`) cùng kiểm tra lints (`npx eslint`) để đảm bảo chất lượng code và không có lỗi biên dịch

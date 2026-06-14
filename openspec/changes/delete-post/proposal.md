## Why

Cung cấp chức năng xóa bài viết trực tiếp từ giao diện Admin Dashboard giúp quản trị viên dễ dàng quản lý nội dung portfolio, loại bỏ các bài viết cũ, bài viết lỗi hoặc các bài viết nháp mà không cần thao tác thủ công trên mã nguồn hoặc qua Git.

## What Changes

- **Trang Dashboard Admin (`/admin/dashboard`)**:
  - Bổ sung nút "Xóa" (Delete) với thiết kế trực quan bên cạnh mỗi bài viết trong danh sách quản lý.
  - Tích hợp một hộp thoại xác nhận (Confirmation Modal) trước khi thực hiện xóa nhằm ngăn ngừa hành động vô tình xóa bài viết quan trọng.
- **API Route mới (`DELETE /api/posts/delete`)**:
  - Xây dựng API bảo mật, chỉ cho phép thực thi khi có session cookie Admin hợp lệ.
  - Thực hiện xóa tệp tin Markdown `.md` vật lý tương ứng của bài viết trong thư mục `src/data/posts/`.
  - Thực hiện dọn dẹp (xóa key) lượt xem của bài viết tương ứng trong tệp cấu hình lượt xem cục bộ `src/data/post-views.json`.
- **Logic cập nhật giao diện phía Client**:
  - Sau khi xóa thành công, giao diện Dashboard lập tức được cập nhật mà không cần tải lại toàn bộ trang (sử dụng Next.js `router.refresh()`).
  - Hiển thị thông báo (toast hoặc alert) rõ ràng về kết quả của hành động xóa.

## Capabilities

### New Capabilities

- `post-deletion`: Xử lý logic xóa tệp tin bài viết tĩnh và làm sạch dữ liệu lượt xem liên quan ở phía Server một cách an toàn và có xác thực quyền Admin.

### Modified Capabilities

- `admin-dashboard`: Tích hợp các thành phần giao diện phục vụ hành động xóa (nút xóa, modal xác nhận, xử lý trạng thái đang xóa và thông báo thành công).

## Impact

- **API Routes mới**: `/api/posts/delete` hỗ trợ phương thức HTTP `DELETE` (hoặc `POST` fallback).
- **Cơ sở dữ liệu cục bộ**: Cập nhật file `src/data/post-views.json` khi có bài viết bị xóa để loại bỏ thông tin lượt xem dư thừa.
- **Tệp tin mã nguồn bị ảnh hưởng**:
  - Giao diện danh sách bài viết trên trang Admin Dashboard cần được bổ sung nút bấm và modal xác nhận. Do trang Dashboard hiện tại có thể là Server Component, chúng ta có thể đưa phần quản lý danh sách hoặc nút xóa vào một Client Component để xử lý logic tương tác động tốt hơn.

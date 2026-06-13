## Context

Quản trị viên đã có thể đăng nhập vào hệ thống thông qua trang `/admin/login` (với cookie `admin_session`) và tạo bài viết mới dưới dạng Markdown lưu trong `src/data/posts` qua API `/api/posts/create`. Lượt xem được theo dõi cục bộ thông qua file `src/data/post-views.json` qua API `/api/posts/views`.
Tuy nhiên, chưa có cơ chế xóa bài viết từ giao diện Dashboard, buộc quản trị viên phải xóa file thủ công và dọn dẹp file views bằng tay.

## Goals / Non-Goals

**Goals:**
- Bổ sung cột "Thao tác" vào bảng danh sách bài viết trên Admin Dashboard `/admin/dashboard`.
- Tạo một Client Component `DeletePostButton` bóng bẩy, hiện đại, tích hợp modal xác nhận xóa đẹp mắt (sử dụng glassmorphism, hiệu ứng chuyển động mượt mà) để quản lý hành động xóa bài viết.
- Tạo API Route bảo mật `DELETE /api/posts/delete` để thực hiện xóa file `.md` vật lý tương ứng của bài viết.
- Khi một bài viết bị xóa, tự động loại bỏ lượt xem tương ứng của nó trong file `src/data/post-views.json` để giữ dữ liệu luôn sạch sẽ và đồng bộ.
- Tự động cập nhật danh sách bài viết trên Dashboard sau khi xóa mà không cần tải lại toàn bộ trang (sử dụng Next.js `router.refresh()`).

**Non-Goals:**
- Hỗ trợ khôi phục bài viết đã xóa (Trash / Recycle Bin). Việc xóa bài viết là vĩnh viễn và không thể khôi phục.
- Hỗ trợ xóa hàng loạt bài viết cùng lúc (bulk delete). Chỉ hỗ trợ xóa từng bài viết một.

## Decisions

### 1. Phương thức xóa và API
- **Lựa chọn**: Tạo API `src/app/api/posts/delete/route.ts` xử lý HTTP method `DELETE` nhận body JSON chứa `slug` của bài viết cần xóa.
- **Lý do**: Đây là phương thức chuẩn RESTful. API sẽ đọc cookie `admin_session`, xác thực token qua `verifySessionToken` ở Server. Nếu hợp lệ, nó sẽ xóa file `src/data/posts/[slug].md`.
- **Giải pháp thay thế**: Sử dụng `POST` hoặc `GET` với query parameter. Tuy nhiên, `DELETE` thể hiện rõ ý nghĩa ngữ nghĩa của hành động và an toàn hơn.

### 2. Dọn dẹp dữ liệu lượt xem (Views Database Clean Up)
- **Lựa chọn**: Trong luồng xử lý của API xóa bài viết, sau khi xóa thành công tệp tin Markdown, tiến hành đọc file `src/data/post-views.json`, xóa key `slug` tương ứng và ghi lại file.
- **Lý do**: Đảm bảo tệp tin JSON không bị phình to theo thời gian bởi các bài viết rác đã bị xóa, giữ dữ liệu thống kê đồng bộ.
- **Giải pháp thay thế**: Giữ nguyên lượt xem của bài viết đã xóa. Tuy nhiên, điều này sẽ tạo ra dữ liệu mồ côi (orphaned data) không bao giờ được sử dụng lại.

### 3. Tương tác UI và Modal Xác nhận (Confirmation Modal)
- **Lựa chọn**: Sử dụng Client Component `DeletePostButton` bọc nút xóa và hộp thoại xác nhận (modal). Modal được dựng trực tiếp bằng CSS/Tailwind với hiệu ứng Backdrop blur, border tinh tế và các nút bấm mang độ tương phản cao (nút Hủy màu xám nhạt, nút Xóa màu đỏ sáng).
- **Lý do**: Đảm bảo trải nghiệm người dùng cao cấp, chuyên nghiệp và an toàn. Tránh việc dùng `window.confirm` cổ điển vốn không đồng bộ với thiết kế bóng bẩy của Dashboard.
- **Giải pháp thay thế**: Dùng `window.confirm` của trình duyệt. Trực quan nhưng trông kém chuyên nghiệp và không wow người dùng.

### 4. Cập nhật danh sách sau khi xóa
- **Lựa chọn**: Gọi `router.refresh()` từ `next/navigation` sau khi API xóa trả về thành công và hiển thị toast thông báo.
- **Lý do**: `router.refresh()` sẽ yêu cầu Next.js fetch lại dữ liệu mới nhất từ Server cho các Server Components đang hiển thị (trong đó có danh sách posts được tải từ `getAllPosts()`), làm mới giao diện ngay lập tức mà không mất trạng thái Client hiện tại (Client-side state).

## Risks / Trade-offs

- **[Risk] Lỗi do cố gắng xóa tệp đang được đọc hoặc không tồn tại**
  - *Mitigation*: API sẽ kiểm tra sự tồn tại của tệp `src/data/posts/[slug].md` bằng `fs.existsSync` trước khi gọi `fs.unlinkSync`. Nếu tệp không tồn tại, trả về `404 Not Found`.
- **[Risk] Xung đột đọc/ghi tệp views JSON khi xóa**
  - *Mitigation*: Dùng try/catch cẩn thận khi đọc và ghi file JSON. Với lượng truy cập admin thấp, khả năng xung đột ghi file hầu như bằng không.
- **[Risk] Xóa nhầm do click đúp hoặc lag mạng**
  - *Mitigation*: Vô hiệu hóa (disable) nút xác nhận xóa và hiển thị trạng thái "Đang xóa..." khi request đang được gửi đi để tránh gửi nhiều yêu cầu xóa liên tiếp.

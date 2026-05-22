## ADDED Requirements

### Requirement: Authorization Validation
Hệ thống MUST kiểm tra quyền truy cập của Admin bằng session cookie `admin_session` trước khi thực thi việc xóa bài viết. Nếu cookie không tồn tại hoặc không hợp lệ, hệ thống SHALL từ chối yêu cầu.

#### Scenario: Deny unauthorized request
- **WHEN** gửi yêu cầu xóa bài viết tới `/api/posts/delete` mà không có session cookie hợp lệ
- **THEN** hệ thống SHALL trả về mã lỗi `401` hoặc `403` và không thực hiện xóa bài viết

### Requirement: File Deletion
Khi nhận được yêu cầu xóa hợp lệ từ Admin cùng với slug của bài viết, hệ thống SHALL định vị tệp tin Markdown `.md` tương ứng trong thư mục `src/data/posts` và thực hiện xóa tệp tin này khỏi hệ thống.

#### Scenario: Successfully delete markdown file
- **WHEN** Admin gửi yêu cầu xóa bài viết có slug tồn tại kèm session cookie hợp lệ
- **THEN** hệ thống SHALL xóa tệp tin `src/data/posts/<slug>.md` và trả về mã trạng thái thành công `200 OK`

#### Scenario: Handle non-existing file
- **WHEN** Admin gửi yêu cầu xóa bài viết có slug không tồn tại kèm session cookie hợp lệ
- **THEN** hệ thống SHALL trả về mã lỗi `404 Not Found` để báo cáo bài viết không tồn tại

### Requirement: Clean Up Views Database
Khi xóa một bài viết, hệ thống SHALL đồng thời loại bỏ bản ghi lượt xem tương ứng của bài viết đó trong tệp tin `src/data/post-views.json` để dọn dẹp bộ nhớ và giữ dữ liệu đồng bộ.

#### Scenario: Successfully clean up views data
- **WHEN** tệp tin Markdown được xóa thành công
- **THEN** hệ thống SHALL cập nhật tệp tin `src/data/post-views.json` bằng cách loại bỏ key tương ứng với slug của bài viết đã xóa

### Requirement: Delete Post Button and Confirmation Dialog
Hệ thống SHALL hiển thị nút xóa bên cạnh mỗi bài viết trong danh sách trên Dashboard. Khi Admin nhấn vào nút xóa, hệ thống MUST hiển thị một hộp thoại xác nhận (Confirmation Dialog) và chỉ thực hiện gửi yêu cầu API xóa khi Admin xác nhận đồng ý.

#### Scenario: Cancel deletion
- **WHEN** Admin nhấn nút xóa bài viết nhưng chọn Hủy bỏ (Cancel) trên hộp thoại xác nhận
- **THEN** hệ thống SHALL đóng hộp thoại và không thực hiện bất kỳ hành động xóa nào

#### Scenario: Confirm deletion and dynamic refresh
- **WHEN** Admin nhấn nút xóa bài viết và chọn Xác nhận (Confirm) trên hộp thoại xác nhận
- **THEN** hệ thống SHALL gọi API `/api/posts/delete`, hiển thị trạng thái đang xử lý, cập nhật danh sách bài viết trên giao diện Dashboard mà không cần tải lại toàn bộ trang và hiển thị thông báo thành công

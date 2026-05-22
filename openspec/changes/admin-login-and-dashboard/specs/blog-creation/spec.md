## ADDED Requirements

### Requirement: Blog Creation Form
Hệ thống SHALL cung cấp biểu mẫu tạo bài viết mới ngay trong giao diện Dashboard, bao gồm các trường: Tiêu đề (Title), Mô tả (Description), Ảnh bìa (Cover Image URL), Các thẻ (Tags - phân tách bằng dấu phẩy) và Nội dung bài viết (Markdown Content).

#### Scenario: Display Creation Form
- **WHEN** admin bấm vào nút "Thêm bài viết mới" trên Dashboard
- **THEN** hệ thống SHALL hiển thị form điền thông tin bài viết mới với các trường yêu cầu nhập liệu và nút Xác nhận

### Requirement: Blog Creation API
Hệ thống SHALL cung cấp API `/api/posts/create` để xử lý yêu cầu tạo bài viết mới. API này MUST kiểm tra tính hợp lệ của phiên đăng nhập của Admin trước khi thực hiện.

#### Scenario: Authorize Blog Creation
- **WHEN** một yêu cầu tạo bài viết không mang theo session cookie hợp lệ được gửi tới `/api/posts/create`
- **THEN** hệ thống SHALL từ chối yêu cầu và trả về mã trạng thái `403 Forbidden`

### Requirement: Markdown Post Writing
Khi nhận được yêu cầu hợp lệ từ Admin, hệ thống SHALL tự động tạo slug từ tiêu đề bài viết, sinh frontmatter và lưu bài viết thành một file `.md` mới trong thư mục `src/data/posts/` của dự án.

#### Scenario: Successfully Create Markdown File
- **WHEN** admin gửi dữ liệu bài viết hợp lệ tới `/api/posts/create`
- **THEN** hệ thống SHALL tạo file `src/data/posts/<slug>.md` chứa frontmatter chuẩn và nội dung bài viết, đồng thời trả về mã phản hồi `200 OK`

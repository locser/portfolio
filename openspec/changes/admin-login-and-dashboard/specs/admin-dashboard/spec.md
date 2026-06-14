## ADDED Requirements

### Requirement: Admin Dashboard Panel
Hệ thống SHALL cung cấp giao diện quản trị Admin Dashboard tại đường dẫn `/admin/dashboard` để quản lý các bài viết và số liệu thống kê.

#### Scenario: Display Admin Dashboard
- **WHEN** admin truy cập trang `/admin/dashboard` với phiên làm việc hợp lệ
- **THEN** hệ thống SHALL hiển thị giao diện quản lý đầy đủ thông tin thống kê và danh sách bài viết

### Requirement: Blog Stats Display
Hệ thống SHALL hiển thị các chỉ số thống kê tổng hợp tại trang Dashboard bao gồm: Tổng số bài viết (Total Posts) và Tổng số lượt xem (Total Views) của tất cả các bài viết cộng lại.

#### Scenario: Display Correct Statistics
- **WHEN** dashboard tải dữ liệu thành công
- **THEN** hệ thống SHALL tính toán và hiển thị chính xác tổng số bài viết Markdown trong dự án và tổng số lượt xem lấy từ file lưu trữ

### Requirement: Posts List Grid
Hệ thống SHALL hiển thị danh sách toàn bộ các bài viết hiện tại dưới dạng bảng hoặc thẻ lưới (grid) chứa đầy đủ thông tin: Tiêu đề bài viết, Ngày đăng bài, Các thẻ tag phân loại và Số lượt xem tương ứng của từng bài viết.

#### Scenario: Display Posts Table
- **WHEN** trang Dashboard được hiển thị
- **THEN** hệ thống SHALL kết xuất danh sách bài viết được sắp xếp theo thời gian mới nhất lên giao diện quản lý

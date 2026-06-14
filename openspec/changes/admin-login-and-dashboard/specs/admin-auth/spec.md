## ADDED Requirements

### Requirement: Admin Authentication Screen
Hệ thống SHALL cung cấp giao diện đăng nhập cho quản trị viên tại đường dẫn `/admin/login` chứa form nhập Tên đăng nhập (Username) và Mật khẩu (Password).

#### Scenario: Display Login Form
- **WHEN** người dùng truy cập trang `/admin/login`
- **THEN** hệ thống SHALL hiển thị form đăng nhập với các trường Username, Password và nút Đăng nhập

### Requirement: Admin Login Authentication API
Hệ thống SHALL cung cấp API `/api/admin/login` để xác thực thông tin đăng nhập của quản trị viên. Tài khoản mặc định là `admin`, mật khẩu là `loc123@@`. Mật khẩu gửi lên MUST được băm bằng SHA-256 và đối chiếu với mã băm bảo mật `f0e1d03486839fc5047e91376fa023d1c3b7da90c7bb98db09dbf705e0b5fde5`.

#### Scenario: Successful Login
- **WHEN** người dùng gửi yêu cầu đăng nhập hợp lệ với username là `admin` và password là `loc123@@`
- **THEN** hệ thống SHALL thiết lập cookie HTTP-Only `admin_session` chứa chữ ký hợp lệ và trả về mã phản hồi `200 OK` kèm thông báo thành công

#### Scenario: Failed Login
- **WHEN** người dùng gửi yêu cầu đăng nhập sai tên đăng nhập hoặc mật khẩu
- **THEN** hệ thống SHALL trả về mã phản hồi `401 Unauthorized` kèm thông điệp báo lỗi chi tiết và không thiết lập cookie phiên làm việc

### Requirement: Session Validation
Hệ thống SHALL cung cấp cơ chế kiểm tra phiên làm việc hiện tại của Admin thông qua session cookie `admin_session` để quyết định quyền truy cập vào Dashboard và các API quản trị.

#### Scenario: Valid Session Access
- **WHEN** quản trị viên đã đăng nhập và truy cập trang `/admin/dashboard` với cookie `admin_session` hợp lệ
- **THEN** hệ thống SHALL cho phép hiển thị nội dung trang Dashboard

#### Scenario: Invalid Session Redirect
- **WHEN** người dùng chưa đăng nhập hoặc cookie phiên hết hạn truy cập trang `/admin/dashboard`
- **THEN** hệ thống SHALL tự động chuyển hướng người dùng về trang đăng nhập `/admin/login`

### Requirement: Admin Logout
Hệ thống SHALL cung cấp nút Đăng xuất trên giao diện Dashboard gọi tới API `/api/admin/logout` để hủy phiên làm việc.

#### Scenario: Logout Action
- **WHEN** quản trị viên click vào nút "Đăng xuất"
- **THEN** hệ thống SHALL xóa cookie `admin_session`, hủy phiên làm việc phía server và chuyển hướng người dùng về trang đăng nhập `/admin/login`

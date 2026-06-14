## ADDED Requirements

### Requirement: Local Post Views Database
Hệ thống SHALL lưu trữ số lượng lượt xem của từng bài viết trong file JSON cục bộ tại `src/data/post-views.json` dạng key-value, sử dụng slug làm key và số lượt xem làm value. Nếu file chưa tồn tại, hệ thống SHALL tự động tạo file mới với nội dung là `{}`.

#### Scenario: Read Non-existent Views File
- **WHEN** hệ thống truy vấn lượt xem của một bài viết lần đầu tiên và file `post-views.json` chưa được khởi tạo
- **THEN** hệ thống SHALL tự động tạo file và trả về số lượt xem mặc định là `0`

### Requirement: Record Post View API
Hệ thống SHALL cung cấp API `/api/posts/views` hỗ trợ phương thức `POST` để tăng số lượt xem của bài viết thêm 1 đơn vị khi người dùng đọc bài viết đó.

#### Scenario: Increment View Count
- **WHEN** client gửi yêu cầu `POST` tới `/api/posts/views` kèm theo tham số `slug`
- **THEN** hệ thống SHALL tăng số lượt xem của bài viết đó lên 1 đơn vị trong file `post-views.json` và trả về số lượt xem mới

### Requirement: Query Views API
API `/api/posts/views` SHALL hỗ trợ phương thức `GET` để truy vấn số lượt xem của một bài viết cụ thể hoặc danh sách lượt xem của tất cả các bài viết.

#### Scenario: Get Views for All Posts
- **WHEN** client gửi yêu cầu `GET` tới `/api/posts/views` không kèm slug
- **THEN** hệ thống SHALL trả về toàn bộ dữ liệu lượt xem dưới dạng đối tượng JSON

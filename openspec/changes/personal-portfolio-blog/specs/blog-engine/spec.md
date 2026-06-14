## ADDED Requirements

### Requirement: Local Markdown Loading
Hệ thống SHALL tải dữ liệu bài viết tĩnh từ thư mục cục bộ (ví dụ: `src/data/posts` hoặc `content/posts`) chứa các file `.md` hoặc `.mdx` có đầy đủ front-matter (tiêu đề, ngày viết, mô tả, tags, ảnh bìa).

#### Scenario: Tải danh sách bài viết từ local thành công
- **WHEN** hệ thống khởi tạo trang danh sách blog
- **THEN** hệ thống đọc thành công các file markdown, phân tích cú pháp front-matter và trả về danh sách bài viết đã được sắp xếp theo ngày đăng mới nhất.

### Requirement: No Authentication Required for Readers
Hệ thống SHALL cho phép tất cả độc giả truy cập và đọc mọi bài viết trên blog mà không yêu cầu đăng nhập hay xác thực tài khoản.

#### Scenario: Độc giả vãng lai đọc bài viết
- **WHEN** một người dùng chưa đăng nhập truy cập vào trang danh sách blog hoặc trang chi tiết bài viết
- **THEN** hệ thống hiển thị đầy đủ nội dung bài viết và không hiển thị bất kỳ yêu cầu đăng nhập hay rào cản thanh toán nào.

### Requirement: Blog Post List Display
Hệ thống SHALL cung cấp một giao diện hiển thị danh sách bài viết dạng lưới hoặc danh sách đơn giản, hiển thị các thông tin: tiêu đề, ngày đăng, mô tả ngắn, ước tính thời gian đọc (reading time) và danh mục tags.

#### Scenario: Xem danh sách bài viết
- **WHEN** người dùng truy cập trang `/blog`
- **THEN** hệ thống hiển thị danh sách các bài viết với đầy đủ thông tin tóm tắt và hiển thị bộ lọc/tìm kiếm.

### Requirement: Blog Post Detail Rendering
Hệ thống SHALL hiển thị nội dung chi tiết bài viết từ file Markdown dưới định dạng HTML có kiểu dáng đẹp, dễ đọc, hỗ trợ các khối code (syntax highlighting), trích dẫn (blockquote), bảng (table) và hình ảnh.

#### Scenario: Xem chi tiết bài viết
- **WHEN** người dùng truy cập vào trang `/blog/[slug]` với slug hợp lệ
- **THEN** hệ thống render đầy đủ nội dung Markdown của bài viết sang HTML chất lượng cao, đi kèm mục lục (Table of Contents) tự động và nút quay lại trang danh sách.

### Requirement: Search and Filter Capabilities
Hệ thống SHALL cung cấp thanh tìm kiếm theo tiêu đề/mô tả bài viết và bộ lọc theo tags để người dùng dễ dàng tìm kiếm bài viết mong muốn.

#### Scenario: Tìm kiếm bài viết theo từ khóa
- **WHEN** người dùng nhập từ khóa tìm kiếm vào thanh tìm kiếm ở trang danh sách blog
- **THEN** hệ thống ngay lập tức lọc và hiển thị danh sách bài viết có tiêu đề hoặc mô tả chứa từ khóa đó.

#### Scenario: Lọc bài viết theo tag
- **WHEN** người dùng click vào một tag cụ thể
- **THEN** hệ thống chỉ hiển thị các bài viết có gắn tag đó.

### Requirement: Suggested & Next/Prev Post Navigation
Hệ thống SHALL hiển thị gợi ý bài viết liên quan (cùng chủ đề/tag) hoặc cung cấp các nút chuyển hướng nhanh sang bài viết tiếp theo / bài viết trước đó ở cuối mỗi trang chi tiết bài viết.

#### Scenario: Xem gợi ý và chuyển hướng nhanh ở cuối bài viết
- **WHEN** người dùng cuộn đến cuối trang chi tiết bài viết tại `/blog/[slug]`
- **THEN** hệ thống hiển thị danh sách gợi ý 2-3 bài viết liên quan hoặc 2 nút điều hướng mượt mà ("Bài trước", "Bài tiếp theo") để người đọc dễ dàng chuyển đổi nội dung.


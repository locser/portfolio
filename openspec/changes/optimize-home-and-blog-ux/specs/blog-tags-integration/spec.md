## ADDED Requirements

### Requirement: BlogPost Tags Display in Article Header
Trang chi tiết bài viết (`/blog/[slug]`) SHALL hiển thị danh sách tất cả các tag (thẻ từ khóa) của bài viết ở phần header đầu trang, ngay phía bên dưới tiêu đề chính hoặc bên cạnh ngày tháng/thời gian đọc, nhằm giúp người đọc nhận biết chủ đề nhanh chóng và tăng tính điều hướng.

#### Scenario: Viewing tags at the top of an article
- **WHEN** người dùng mở một bài viết chi tiết tại đường dẫn `/blog/xxx-xxx`
- **THEN** hệ thống SHALL lấy thuộc tính `tags` từ metadata của file bài viết MDX và kết xuất chúng thành các thẻ (badge/pill) tinh tế, có màu nền nhẹ và chữ tương phản phù hợp (hỗ trợ cả dark và light mode) đặt ngay dưới tiêu đề của bài viết.

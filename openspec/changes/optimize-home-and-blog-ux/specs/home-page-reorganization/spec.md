## ADDED Requirements

### Requirement: Home Page Section Reordering and Slimming
Hệ thống SHALL thay đổi thứ tự hiển thị các section tại trang chủ Next.js, đưa phần Blog lên ngay phía dưới phần Projects (hoặc phía trên Experience) để tạo sự chú ý mạnh hơn vào các bài viết mới. Các section như Experience và TechStack SHALL được thiết kế lại theo cách cô đọng hơn, giảm thiểu khoảng cách đệm (padding/margin) và chiều dài cuộn trang tổng thể để người dùng có thể lướt hết trang chủ chỉ trong 2-3 lần cuộn màn hình.

#### Scenario: Navigating optimized home page sections
- **WHEN** người dùng truy cập trang chủ `http://localhost:8080/`
- **THEN** người dùng SHALL thấy section Blog nằm ngay sau phần Projects, đứng trước Experience và TechStack, giúp bài viết mới nhất đập ngay vào mắt người dùng.
- **THEN** chiều dài cuộn trang chủ SHALL được giảm bớt tối đa nhờ cấu trúc giao diện cô đọng của Experience và TechStack.

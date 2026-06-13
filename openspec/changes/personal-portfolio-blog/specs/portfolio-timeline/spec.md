## ADDED Requirements

### Requirement: Authentic About Me Presentation
Hệ thống SHALL cung cấp một trang giới thiệu bản thân chứa nội dung chia sẻ chân thực về sở thích, triết lý sống và định hướng cá nhân của tác giả, trình bày dưới dạng bố cục typographic thoáng đãng và dễ đọc.

#### Scenario: Người dùng xem trang About Me
- **WHEN** người dùng truy cập vào trang giới thiệu bản thân `/about`
- **THEN** hệ thống hiển thị văn bản mô tả ngắn gọn, hình ảnh cá nhân tối giản (nếu có), danh sách các sở thích và định hướng, mang lại cảm giác gần gũi, giản dị.

### Requirement: Interactive Career and Experience Timeline
Hệ thống SHALL hiển thị một trục thời gian (timeline) tương tác, thể hiện sự nghiệp, học vấn và các dấu mốc trải nghiệm cuộc sống đáng nhớ của tác giả theo thứ tự thời gian tuyến tính.

#### Scenario: Tương tác với trục thời gian sự nghiệp
- **WHEN** người dùng cuộn qua phần timeline sự nghiệp
- **THEN** hệ thống hiển thị các mốc thời gian rõ ràng (năm, chức danh, mô tả ngắn về những gì đã học/đạt được) với các hiệu ứng fade-in nhẹ nhàng khi cuộn tới.

### Requirement: Featured Projects Showcase
Hệ thống SHALL hiển thị danh sách các dự án tiêu biểu mà tác giả đã và đang phát triển, kèm theo mô tả ngắn, danh sách các công nghệ cốt lõi và liên kết trực tiếp tới mã nguồn (GitHub) hoặc trang chạy thử (Demo Live).

#### Scenario: Xem danh sách dự án nổi bật
- **WHEN** người dùng mở mục dự án trên trang chủ hoặc trang riêng biệt
- **THEN** hệ thống hiển thị các thẻ dự án tối giản, cho phép người dùng click để truy cập trực tiếp vào link mã nguồn hoặc demo ngoài trang web.

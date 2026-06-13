## ADDED Requirements

### Requirement: Sticky Header Distinction on Scroll
Header điều hướng cố định (sticky header) trên cả trang danh sách blog và trang chi tiết bài viết SHALL có độ mờ màu nền đục hơn (ví dụ: `bg-black/90` trong dark mode và `bg-white/90` trong light mode) và được bổ sung viền dưới hoặc đổ bóng nhẹ để tạo ranh giới tương phản cực kỳ rõ ràng, tách biệt hoàn toàn với nội dung cuộn bên dưới khi người dùng lướt trang.

#### Scenario: Scrolling content beneath the sticky header
- **WHEN** người dùng cuộn (scroll) trang chi tiết hoặc trang danh sách bài viết xuống dưới
- **THEN** phần nội dung bài viết lướt qua dưới Header SHALL bị che phủ bởi nền bán trong suốt có độ che phủ cao (backdrop-blur và opacity đục), và đường viền dưới của Header (border-b) hoặc shadow SHALL thể hiện rõ rệt ranh giới cố định của Header, không bị trùng màu hay lẫn lộn với chữ của nội dung.

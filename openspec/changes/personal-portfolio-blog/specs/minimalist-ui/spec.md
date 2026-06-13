## ADDED Requirements

### Requirement: Typography Restriction
Hệ thống SHALL chỉ sử dụng tối đa 1 font chữ sans-serif hiện đại duy nhất (như `Inter` hoặc `Outfit`) cho toàn bộ trang web (bao gồm tiêu đề, văn bản, menu, nhãn) để tối ưu hóa sự thống nhất và giảm sự lộn xộn về mặt hình ảnh.

#### Scenario: Tải trang web với font thống nhất
- **WHEN** bất kỳ trang nào của website được tải
- **THEN** hệ thống render toàn bộ nội dung với font chữ thống nhất đã chọn và phân biệt mức độ quan trọng bằng kích thước chữ (font-size) và độ đậm (font-weight) thay vì đổi font khác.

### Requirement: Monochromatic Color Scheme
Hệ thống SHALL sử dụng bảng màu đơn sắc tối giản (Trắng, Đen, và các sắc độ Xám mịn màng) làm chủ đạo, và chỉ cho phép dùng tối đa một màu nhấn (Accent Color) duy nhất cực kỳ tinh tế (như xám tro, xanh slate nhẹ) cho các trạng thái active hoặc hover.

#### Scenario: Hiển thị giao diện tối giản
- **WHEN** giao diện hiển thị các khối nội dung, nút bấm hoặc đường link
- **THEN** hệ thống không sử dụng các màu sắc sặc sỡ (như đỏ tươi, lục neon, lam đậm), mà dùng các tông màu xám nhẹ, đường viền siêu mỏng và đổ bóng cực kỳ mờ mịn để phân cách.

### Requirement: Seamless Light and Dark Theme Switching
Hệ thống SHALL tích hợp bộ chuyển đổi Light/Dark theme mượt mà, ghi nhớ lựa chọn của người dùng thông qua LocalStorage hoặc System Preference, đồng thời SHALL triệt tiêu hiện tượng nháy sáng (flash of unstyled content - hydration mismatch) khi tải trang.

#### Scenario: Người dùng chuyển đổi theme sáng/tối
- **WHEN** người dùng click vào nút chuyển đổi theme
- **THEN** hệ thống chuyển đổi bảng màu của toàn bộ trang web ngay lập tức với hiệu ứng transition mượt mà (0.2s - 0.3s) và lưu lại trạng thái lựa chọn.

### Requirement: Subtle Micro-interactions
Hệ thống SHALL áp dụng các chuyển động nhỏ (micro-animations) cực kỳ nhẹ nhàng (ví dụ: fade-in nhẹ khi chuyển trang, hover scale 1.01x nhẹ nhàng ở các bài viết) để tạo cảm giác trang web "sống động" nhưng không làm người dùng xao nhãng.

#### Scenario: Hover vào thẻ bài viết blog
- **WHEN** người dùng di chuột lên một thẻ bài viết (post card)
- **THEN** thẻ bài viết dịch chuyển nhẹ lên trên (hoặc tăng độ đậm của viền/chữ) một cách mượt mà thông qua CSS transition hoặc Framer Motion, mang lại phản hồi trực quan tinh tế.

### Requirement: Smooth Performance and Lightweight Client Storage
Hệ thống SHALL đảm bảo việc cuộn trang và chuyển hướng trang diễn ra cực kỳ mượt mà (60 FPS), hoàn toàn không bị giật lag (stuttering). Đồng thời, hệ thống SHALL tối ưu hóa bộ nhớ client-side, tránh lưu trữ quá nhiều trạng thái không cần thiết hoặc lạm dụng LocalStorage.

#### Scenario: Trải nghiệm lướt web và chuyển hướng mượt mà
- **WHEN** người dùng cuộn (scroll) qua các trang (danh sách blog, timeline) hoặc click chuyển trang
- **THEN** trang web phản hồi tức thì với hiệu ứng cuộn mượt mà (smooth scrolling) được hỗ trợ phần cứng, không bị sụt giảm khung hình, và không phát sinh các dữ liệu lưu trữ cồng kềnh dưới client.


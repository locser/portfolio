## Context

Developer backend (3 năm kinh nghiệm với NestJS và Java Core) muốn tăng tốc hiệu quả học tập thông qua tương tác phản biện thực tế với AI. Hệ thống hiện tại có cấu trúc `.agent/skills/` nhưng chưa có kỹ năng nào chuyên biệt cho việc dạy học thực chứng (Hands-on Lab) và phản biện phi-mì-ăn-liền. Do đó, thiết kế này hướng tới việc tích hợp một Custom Skill có trạng thái (Stateful Custom Skill) giúp đồng hành, phát triển bản thân và mổ xẻ lỗi sâu sắc.

## Goals / Non-Goals

**Goals:**
- Triển khai Custom Skill `/learn-with-me` tại thư mục `.agent/skills/learn-with-me/`.
- Thiết lập tệp `.agent/skills/learn-with-me/learning_profile.json` để lưu trữ hồ sơ học tập có trạng thái của nhà phát triển, hỗ trợ cập nhật định kỳ sau mỗi 5-10 câu trả lời.
- Định nghĩa chuẩn cấu trúc thư mục đầu ra `/learning/labs/<keyword>/` chứa báo cáo lý thuyết thực chứng `learning_report.md` và mã thực nghiệm tái hiện `reproduce_guide.md`.
- Xây dựng Giao thức phản biện nghiêm túc: Chỉ thẳng lỗi sai ngay lập tức khi phát hiện > 2 lỗi lớn, sử dụng ma trận điểm số định lượng toán học khi bất đồng.

**Non-Goals:**
- Không tạo giao diện người dùng đồ họa (GUI) mới. Tất cả các tương tác vẫn diễn ra thông qua giao diện chat của Agent.
- Không tự động thực thi các script stress-test hoặc lệnh phá hủy trực tiếp trên máy chủ của Dev nhằm đảm bảo tính an toàn. AI chỉ cung cấp hướng dẫn (how-to) và Dockerfile/Docker Compose để Dev tự chạy.

## Decisions

### 1. Lưu trữ Profile học tập bằng tệp JSON cục bộ thay vì Database
- **Lựa chọn:** Lưu trữ tại `.agent/skills/learn-with-me/learning_profile.json`.
- **Lý do:** Đơn giản, cực kỳ nhẹ, dễ dàng được agent nạp vào context khi bắt đầu phiên học và dễ dàng ghi đè tuần tự mà không cần thiết lập hạ tầng database cồng kềnh.
- **Phương án thay thế:** Không lưu trữ profile (Stateless). Tuy nhiên, phương án này vi phạm cam kết tự kiểm điểm và phát triển cá nhân của Dev vì AI không thể ghi nhớ các điểm yếu dài hạn của Dev qua nhiều phiên học.

### 2. Ưu tiên Docker Compose làm nền tảng sandbox tái hiện
- **Lựa chọn:** Mọi bài lab tái hiện môi trường phức tạp (DB, cache, benchmark tool) đều sử dụng Docker Compose.
- **Lý do:** Tránh xung đột cổng mạng hoặc ô nhiễm môi trường phát triển chính trên Windows của Dev. Docker mang lại tính cô lập (isolation) cực tốt.
- **Phương án thay thế:** Dùng script cài đặt trực tiếp trên OS. Bị loại bỏ vì nguy hiểm, khó gỡ bỏ hoàn toàn và dễ bị lỗi tương thích Windows.

### 3. Giao thức ngắt phản biện khi mắc > 2 lỗi kỹ thuật lớn
- **Lựa chọn:** Cứng hóa quy tắc ngắt thảo luận trong prompt điều phối kỹ năng.
- **Lý do:** Tránh hiện tượng Dev sa lầy vào những giả định sai lầm quá sâu (Rabbit Hole) làm tốn thời gian học tập và tăng dung lượng token vô ích.

## Risks / Trade-offs

- **[Risk]** Định dạng tệp Windows (CRLF) có thể gây lỗi khi Dev chạy các script bash trong sandbox tái hiện.
  - *Mitigation:* Trong `reproduce_guide.md` do AI tạo ra, luôn đi kèm cảnh báo hoặc chỉ dẫn chạy `dos2unix` hoặc viết script bằng Node.js / PowerShell thay vì Bash nguyên bản khi chạy trên Windows.
- **[Risk]** File `learning_profile.json` bị phình to theo thời gian do ghi nhận quá nhiều nhật ký tương tác.
  - *Mitigation:* Thực hiện cơ chế dọn dẹp (cleanup) định kỳ, chỉ lưu tối đa 50 tương tác gần nhất và duy trì kích thước tệp dưới 100KB.

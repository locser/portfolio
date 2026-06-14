## Why

Developer backend 3 năm kinh nghiệm (chủ đạo NestJS, Java Core) cần một người đồng hành học tập kỹ thuật thực thụ có tư duy phản biện ("thinking") cao, trung thực, không nịnh bợ để tăng tốc quá trình phát triển bản thân. Thay vì tiếp thu kiến thức "mì ăn liền" thụ động, giải pháp này giải quyết bài toán học sâu thông qua thảo luận đa chiều, phản biện nghiêm túc và thực chứng thực hành (sandbox tái hiện lỗi/sự việc cụ thể) đi kèm với việc ghi nhận và cải thiện các lỗ hổng kiến thức liên tục qua hồ sơ người học.

## What Changes

- **Thêm Custom Skill mới**: Triển khai kỹ năng `/learn-with-me` đặt trong hệ thống agent (`.agent/skills/learn-with-me`).
- **Quản lý Hồ sơ Người học (Stateful Profile)**: Tích hợp tệp `learning_profile.json` để lưu trữ thông tin kinh nghiệm, các lỗ hổng kiến thức phát hiện được trong 5-10 câu trả lời gần nhất, và cập nhật tự động sau mỗi phiên học.
- **Giao thức Tranh luận & Phản biện Sắc bén (Debate & Correction Protocol)**:
  - Tích hợp bộ lọc ngắt lập luận khi người dùng mắc > 2 lỗi kỹ thuật lớn để kéo họ về giả định đúng ban đầu.
  - Sử dụng ma trận điểm số định lượng toán học khi thảo luận về các giải pháp kiến trúc thay thế.
- **Kết xuất Đầu ra Thực chứng**:
  - Tự động tạo tệp Báo cáo Tri thức `learning_report.md` (bao gồm lý do ra đời công nghệ, đánh đổi trade-offs, biên bản tranh luận và phần tự kiểm điểm cho cả AI và Dev, có đánh số phiên bản và thời gian sửa gần nhất).
  - Tự động tạo tệp Hướng dẫn Tái hiện `reproduce_guide.md` (chứa các bước dựng môi trường Docker, viết bad-code để gây lỗi, stress-test kiểm chứng và good-code tối ưu).

## Capabilities

### New Capabilities

- `learn-with-me-agent-skill`: Cung cấp kỹ năng tương tác `/learn-with-me`, quản lý hồ sơ người học stateful, vận hành quy trình tranh luận phản biện chặt chẽ và kết xuất tài liệu học tập thực chứng sâu sắc.

### Modified Capabilities

*Không có.*

## Impact

- **Hệ thống Agent**: Thêm cấu trúc thư mục mới `.agent/skills/learn-with-me` chứa logic và hướng dẫn hoạt động của skill.
- **Cơ cấu lưu trữ dự án**: Tạo thư mục `/learning/labs/<keyword>/` cho mỗi từ khóa học tập để chứa báo cáo và mã nguồn thực nghiệm mà không ảnh hưởng tới codebase chính trừ khi có sự yêu cầu/đính kèm trực tiếp từ người dùng.

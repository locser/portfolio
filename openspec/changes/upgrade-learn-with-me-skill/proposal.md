## Why

Tệp đặc tả kỹ năng `SKILL.md` hiện tại còn khá ngắn, chỉ dừng lại ở mức khung quy định lý thuyết tổng quan mà thiếu đi các chỉ dẫn thực thi chi tiết. Điều này khiến cho AI Agent thiếu "neo hành vi" và các công cụ tư duy sắc bén để nhập vai một kỹ sư Backend kỳ cựu phản biện sâu sắc. Do đó, việc nâng cấp này là cần thiết để trang bị cho skill bộ câu hỏi chuyên sâu (May đo riêng cho NestJS, Java Core), kịch bản đối thoại mẫu trực quan và cẩm nang xử lý môi trường thực nghiệm tối ưu trên Windows Host.

## What Changes

- **Nâng cấp `SKILL.md` lên phiên bản v1.1.0**:
  - **Bổ sung Deep Questioning Framework**: Thiết lập các chủ đề hỏi sâu (dưới góc nhìn hệ thống under-the-hood) về NestJS (DI scopes, Event Loop, RxJS, Transactions) và Java Core (Virtual Threads, JVM GC tuning, Memory leak static/ThreadLocal).
  - **Bổ sung Reference Chat Transcript**: Mô phỏng kịch bản hội thoại thực tế giữa Dev và AI để làm mẫu hành vi ngắt lập luận (> 2 lỗi sai) và lập ma trận chấm điểm toán học.
  - **Bổ sung Windows Environment Guide**: Định rõ cách xử lý line endings CRLF khi viết script stress-test, phân quyền volume mounts trong Docker on Windows và tối ưu hóa benchmark tools.

## Capabilities

### New Capabilities

*Không có.*

### Modified Capabilities

- `learn-with-me-agent-skill`: Cập nhật đặc tả hành vi của skill học tập phản biện để tích hợp kịch bản mẫu, hướng dẫn đặt câu hỏi và cẩm nang môi trường Windows.

## Impact

- **Tệp kỹ năng của Agent**: Cập nhật trực tiếp tệp `.agent/skills/learn-with-me/SKILL.md` lên v1.1.0. Không gây ảnh hưởng tới bất kỳ thành phần codebase chính nào khác.

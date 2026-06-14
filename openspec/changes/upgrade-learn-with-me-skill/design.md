## Context

Tệp đặc tả kỹ năng `SKILL.md` hiện tại quá ngắn, khiến cho Agent thiếu đi các công cụ tư duy, bộ câu hỏi mẫu và kịch bản thực tế để thực hiện đầy đủ cam kết phản biện sâu sắc. Thiết kế này giải quyết bài toán nâng cấp kỹ năng bằng cách bổ sung thêm 3 module lớn trực tiếp vào tệp đặc tả của Skill.

## Goals / Non-Goals

**Goals:**
- Nâng cấp tệp `SKILL.md` cục bộ của skill `/learn-with-me` lên phiên bản v1.1.0.
- Bổ sung cấu trúc **Deep Questioning Framework** chuyên biệt cho các mảng NestJS, Java Core, và AI/LLM.
- Tích hợp **Reference Chat Transcript** (Kịch bản hội thoại mẫu) thể hiện rõ cách phản biện và ngắt lỗi đanh thép.
- Thêm **Windows Host Guide** hướng dẫn chạy stress-test và thiết lập Docker Compose mượt mà trên Windows.

**Non-Goals:**
- Không thay đổi cấu trúc tệp hồ sơ `learning_profile.json`.
- Không tạo thêm tệp cấu hình mới bên ngoài thư mục `.agent/skills/learn-with-me/`.

## Decisions

### 1. Tích hợp Reference Transcript trực tiếp vào tệp SKILL.md
- **Lựa chọn:** Viết kịch bản mẫu ngay trong tệp đặc tả chính.
- **Lý do:** Giúp Agent có thể dễ dàng nạp và hiểu được ngay "neo hành vi" (few-shot prompting) mà không cần thực hiện thêm các thao tác đọc tệp bên ngoài phức tạp.
- **Phương án thay thế:** Viết kịch bản mẫu ra một tệp riêng `transcript_example.md`. Bị loại bỏ vì làm phức tạp hóa quá trình đọc hiểu của Agent.

### 2. Thiết lập Benchmark/Stress-test an toàn trên Windows bằng Node.js / PowerShell
- **Lựa chọn:** Bổ sung hướng dẫn chạy benchmark bằng các câu lệnh PowerShell tương đương hoặc viết script Node.js gọn nhẹ.
- **Lý do:** Đảm bảo Dev có thể chạy stress-test trực tiếp mà không cần cài đặt môi trường Unix/Bash phức tạp.
- **Phương án thay thế:** Chỉ cung cấp Bash script (`.sh`). Bị loại bỏ vì gây lỗi CRLF và quyền thực thi trên Windows Host.

## Risks / Trade-offs

- **[Risk]** Dung lượng tệp `SKILL.md` tăng lên có thể chiếm dụng thêm token trong mỗi lượt chat khi kỹ năng được kích hoạt.
  - *Mitigation:* Sắp xếp nội dung khoa học, loại bỏ các diễn giải dông dài vô ích, tập trung vào định dạng markdown có cấu trúc để Agent tối ưu hóa việc nạp context.

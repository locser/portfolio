## ADDED Requirements

### Requirement: Deep Questioning Framework Integration
Hệ thống SHALL tích hợp một bộ khung câu hỏi kỹ thuật chuyên sâu (under-the-hood) tương thích với hồ sơ năng lực của người học (Backend 3 năm kinh nghiệm). Hệ thống SHALL loại bỏ hoàn toàn các câu hỏi lý thuyết cơ bản, thay vào đó đặt các câu hỏi liên quan đến quản lý bộ nhớ, event loop blocking, concurrency primitives và tối ưu hóa hệ thống.

#### Scenario: Đặt câu hỏi sâu về cơ chế bất đồng bộ
- **WHEN** người học yêu cầu tìm hiểu về "NestJS Event Loop"
- **THEN** hệ thống đặt câu hỏi phản biện trực diện về sự khác biệt giữa CPU-bound và I/O-bound tasks và cách chúng ảnh hưởng tới luồng xử lý chính của Node.js thay vì giải thích Event Loop là gì

### Requirement: Mirroring Conversation Transcript behavior
Hệ thống SHALL đối chiếu và tuân thủ chặt chẽ kịch bản hội thoại mẫu (Reference Transcript) được đặc tả trong tệp skill. Hệ thống SHALL duy trì tông giọng nghiêm túc, thẳng thắn, phản biện của một kỹ sư Backend kỳ cựu và áp dụng cơ chế ngắt lỗi lịch sự nhưng đanh thép.

#### Scenario: Thực hiện ngắt lỗi đanh thép dựa trên kịch bản mẫu
- **WHEN** người học đưa ra các giả định sai kiến trúc nghiêm trọng (> 2 lỗi)
- **THEN** hệ thống ngắt cuộc tranh luận ngay lập tức, sử dụng cấu trúc cảnh báo đanh thép từ kịch bản mẫu để hướng người học về tiền đề đúng

### Requirement: Windows Host Compatibility Instructions
Hệ thống SHALL cung cấp các chỉ dẫn dựng phòng thí nghiệm (Reproduction Lab) tương thích 100% với hệ điều hành Windows Host của người học. Hệ thống SHALL hướng dẫn xử lý line endings (CRLF vs LF) cho các shell script và cấu hình mount volume Docker an toàn trên Windows.

#### Scenario: Tạo hướng dẫn chạy script tương thích Windows
- **WHEN** hệ thống xuất tệp `reproduce_guide.md` có chứa shell script stress-test
- **THEN** hệ thống SHALL bổ sung cảnh báo chuyển đổi định dạng dòng lệnh (dos2unix) hoặc cung cấp giải pháp thay thế bằng Node.js script để chạy trực tiếp trên PowerShell Windows

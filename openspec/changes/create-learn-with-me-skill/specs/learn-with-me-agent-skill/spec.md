## ADDED Requirements

### Requirement: Stateful Learning Profile Management
Hệ thống SHALL duy trì một tệp hồ sơ học tập có trạng thái của người học dưới dạng JSON (`learning_profile.json`). Tệp này phải ghi nhận: số năm kinh nghiệm, các lỗ hổng kiến thức phát hiện được trong quá trình học tập, và nhật ký tương tác. Hệ thống SHALL tự động cập nhật tệp hồ sơ này vào cuối mỗi phiên học dựa trên 5-10 câu trả lời gần nhất của người học.

#### Scenario: Tự động cập nhật profile sau phiên học
- **WHEN** phiên tương tác `/learn-with-me` kết thúc thành công
- **THEN** hệ thống tự động phân tích 5-10 câu trả lời gần nhất của Dev, trích xuất điểm yếu kỹ thuật mới phát hiện, và ghi đè cập nhật vào `learning_profile.json`

### Requirement: Interactive Session Initialization
Hệ thống SHALL khởi chạy một phiên học tập kỹ thuật thực chứng ngay khi người dùng gõ lệnh `/learn-with-me <keyword>`. Hệ thống SHALL kiểm tra sự tồn tại của tệp được đính kèm trong yêu cầu. Nếu có tệp đính kèm, hệ thống SHALL nạp nội dung của tệp đó làm ngữ cảnh thực tế cho buổi học.

#### Scenario: Khởi chạy có file đính kèm làm ngữ cảnh
- **WHEN** người dùng chạy `/learn-with-me NestJS-Memory-Leak` và đính kèm file `src/app.service.ts`
- **THEN** hệ thống khởi chạy phiên học, nạp nội dung file `src/app.service.ts` để phân tích và sử dụng làm ngữ cảnh thực tế cho các câu hỏi tiếp theo

### Requirement: Debate and Correction Protocol
Hệ thống SHALL phản biện một cách trung thực, trực diện và không nịnh bợ đối với các lập luận của người học. Nếu hệ thống phát hiện người học đưa ra nhiều hơn 2 lỗi kỹ thuật lớn trong một lượt lập luận, hệ thống SHALL ngay lập tức tạm dừng phản biện, chỉ rõ các lỗi sai hướng, và hướng người học quay lại giả định đúng ban đầu.

#### Scenario: Ngắt phản biện khi người học mắc nhiều hơn 2 lỗi sai kỹ thuật
- **WHEN** người học đưa ra 3 lập luận sai về mặt kỹ thuật trong cùng một câu trả lời
- **THEN** hệ thống ngắt tranh luận, chỉ ra chính xác 3 điểm hiểu sai và hướng dẫn người học quay lại tiền đề đúng đắn ban đầu

#### Scenario: Sử dụng ma trận điểm số khi thảo luận kiến trúc bất đồng
- **WHEN** người học và hệ thống bất đồng ý kiến về việc lựa chọn giải pháp công nghệ
- **THEN** hệ thống tự động khởi tạo ma trận điểm số định lượng đa tiêu chí bằng toán học để chấm điểm so sánh, và sử dụng giải pháp có tổng điểm cao nhất làm kết luận đồng nhất

### Requirement: Output Generation and Reproduction Lab
Hệ thống SHALL tự động tạo ra và cập nhật 2 tệp đầu ra tại thư mục `/learning/labs/<keyword>/`: một tệp báo cáo tri thức `learning_report.md` (chứa phiên bản, dấu mốc thời gian, đánh giá trade-offs, biên bản tranh luận và phần tự kiểm điểm) và một tệp hướng dẫn thực hành từng bước `reproduce_guide.md` (chứa Docker Compose tối giản, code gây lỗi, stress-test benchmark và code tối ưu).

#### Scenario: Kết xuất thành công 2 file báo cáo thực chứng
- **WHEN** người học hoàn tất phiên học thực hành và đồng ý kết thúc buổi học
- **THEN** hệ thống ghi nhận kết quả và ghi đè/tạo mới tệp `learning_report.md` và `reproduce_guide.md` tại `/learning/labs/<keyword>/` với đầy đủ cấu trúc định dạng phiên bản và thời gian sửa đổi gần nhất

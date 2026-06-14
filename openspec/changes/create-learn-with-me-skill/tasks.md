## 1. Cấu trúc thư mục & Khởi tạo

- [x] 1.1 Khởi tạo thư mục mới `.agent/skills/learn-with-me`
- [x] 1.2 Tạo tệp hồ sơ học tập rỗng `.agent/skills/learn-with-me/learning_profile.json` với cấu trúc JSON chuẩn đã đặc tả
- [x] 1.3 Tạo thư mục chung lưu trữ kết quả học tập `/learning/labs` ở gốc dự án


## 2. Viết tài liệu đặc tả Kỹ năng (Prompt Engineering)

- [x] 2.1 Tạo tệp `.agent/skills/learn-with-me/SKILL.md` định nghĩa tên kĩ năng `learn-with-me-agent-skill` và mô tả chi tiết
- [x] 2.2 Tích hợp bản cam kết (4 tiêu chí: Trung thực, Không nịnh, Không ưu tiên token, Tự kiểm điểm) vào cấu trúc hành vi của skill
- [x] 2.3 Cấu hình Giao thức phản biện (Quy tắc dừng khi mắc > 2 lỗi, Ma trận chấm điểm toán học khi bất đồng ý kiến) trong phần Guardrails của skill
- [x] 2.4 Định nghĩa mẫu tài liệu đầu ra `learning_report.md` và `reproduce_guide.md` chuẩn hóa dưới dạng template markdown trong tệp skill


## 3. Kiểm thử & Đánh giá Tích hợp

- [x] 3.1 Chạy thử một phiên tương tác với từ khóa thử nghiệm để kiểm chứng khả năng phản biện của skill
- [x] 3.2 Xác minh việc tự động cập nhật lỗ hổng kiến thức vào `learning_profile.json` sau phiên tương tác
- [x] 3.3 Xác minh việc kết xuất chính xác 2 file báo cáo tại `/learning/labs/<keyword>/` với đầy đủ định dạng version/timestamp


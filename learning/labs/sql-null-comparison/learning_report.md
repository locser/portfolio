# [LEARNING REPORT] - SQL NULL Comparison & Three-Valued Logic (3VL)
*   **Version:** 1.0.0 (Cập nhật gần nhất: 2026-05-24 11:55)
*   **Trạng thái:** Đã thông suốt

## I. Tại sao cần công nghệ này?
Trong SQL, `NULL` không phải là một giá trị thông thường mà đại diện cho sự vắng mặt của dữ liệu hoặc thông tin không xác định (Missing/Unknown). Phép so sánh trực tiếp bằng toán tử `=` hoặc `<>` với `NULL` không thể trả về đúng hay sai, đòi hỏi một hệ thống logic đặc biệt là Logic 3 trị (Three-Valued Logic - 3VL) để xử lý. Việc hiểu rõ bản chất này giúp lập trình viên tránh được các lỗi logic âm thầm (silent bugs) khi viết câu truy vấn điều kiện.

## II. Bản chất kỹ thuật & Ứng dụng thực tế
1. **Three-Valued Logic (3VL):**
   - Thay vì chỉ có `TRUE` và `FALSE`, SQL áp dụng 3 trạng thái: `TRUE`, `FALSE`, và `UNKNOWN`.
   - Kết quả so sánh `NULL = NULL`, `NULL <> NULL`, hay bất kỳ phép so sánh giá trị nào với `NULL` đều trả về `UNKNOWN`.
   - Trong mệnh đề `WHERE`, Database Engine chỉ lọc ra các dòng có điều kiện trả về `TRUE`. Các dòng trả về `UNKNOWN` hoặc `FALSE` đều bị loại bỏ.
   - Để kiểm tra giá trị NULL, cần sử dụng toán tử trạng thái `IS NULL` hoặc `IS NOT NULL`, trả về giá trị Boolean nhị phân (`TRUE` / `FALSE`) dựa trên việc đọc trực tiếp Null Bitmap.

2. **Cách lưu trữ vật lý của Database Engine:**
   - Database Engine sử dụng một vùng dữ liệu đặc biệt ở đầu mỗi hàng gọi là **Null Bitmap** để đánh dấu các cột nullable có mang giá trị NULL hay không.
   - Nếu cột được đánh dấu NULL trong bitmap, Engine sẽ bỏ qua hoàn toàn việc đọc/so sánh dữ liệu thô trong ô nhớ vật lý của cột đó, giúp tối ưu hiệu năng.

3. **Chỉ mục (Index) và NULL:**
   - Trong InnoDB (MySQL), các giá trị NULL vẫn được đánh chỉ mục B-Tree nhưng được xếp gom cụm ở đầu mút bên trái (coi như giá trị nhỏ nhất). Trong PostgreSQL, NULL được hỗ trợ đầy đủ trong Index Scan.

## III. Tranh luận & Đánh đổi (Trade-offs)
- **Đánh đổi về UX thiết kế Lab:** Người học phản hồi rằng thay vì AI tự động tạo tệp code lab một cách trực tiếp, AI nên đưa ra các lựa chọn (options) hoặc hỏi ý kiến người học trước xem họ muốn tiếp cận theo cách nào (viết code mô phỏng bằng Node.js, sử dụng Docker DB, hay chỉ giải thích lý thuyết). Đây là một cải tiến quan trọng được ghi nhận cho các phiên học sau.
- **Biên bản phản biện:** Người học đã vượt qua xuất sắc cả 3 câu hỏi phản biện về các phép toán phức tạp của 3VL (`NULL <> NULL` -> `UNKNOWN`, `NOT (NULL = 5)` -> Không trả về, `TRUE OR UNKNOWN` -> `TRUE`), chứng tỏ mức độ thông suốt lý thuyết ở mức sâu sắc.

## IV. Tự kiểm điểm (Post-Mortem & Reflection)
*   **Lỗ hổng tư duy ban đầu của Dev:** Không có lỗ hổng lớn. Dev chỉ muốn hiểu bản chất sâu sắc của cơ chế Database Engine bên dưới so với cách dùng hàm `isNull()` ở tầng ORM/Code thông thường.
*   **Điểm AI cần cải thiện:** Đã quá nóng vội trong việc tạo file code giả lập khi chưa lấy ý kiến người dùng. Lần sau, cần liệt kê các phương án thực chứng (ví dụ: mô phỏng code thô, dựng Docker DB thật, chạy truy vấn trực tiếp) để người dùng tự chọn cách học phù hợp nhất với quỹ thời gian và tài nguyên của họ.

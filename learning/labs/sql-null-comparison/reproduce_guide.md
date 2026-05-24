# [REPRODUCTION LAB] - SQL NULL Comparison & Three-Valued Logic (3VL)
*   **Môi trường đề xuất:** Node.js (Windows Host)

## Step 1: Dựng môi trường (Environment Setup)
Tạo file [engine_simulation.js](file:///c:/ai-projects/my-porfolio/portfolio/learning/labs/sql-null-comparison/engine_simulation.js) chứa mã nguồn giả lập Database Engine thô bằng Node.js. Mã nguồn này sử dụng Buffer để lưu trữ cấu trúc Row vật lý kèm theo cơ chế ghi nhận Null Bitmap.

## Step 2: Kích hoạt Lỗi (Triggering the Issue)
Chạy tệp tin mô phỏng bằng Node.js:
```bash
node engine_simulation.js
```

Chương trình sẽ cố ý so sánh:
1. `WHERE age = 25` trên dòng có `age = NULL` (vùng nhớ vật lý thực tế đang chứa byte rác `0xDEADBEEF`).
2. `WHERE age = NULL` trên dòng có `age = NULL`.

## Step 3: Quan sát và Phân tích (Symptom Analysis)
Đầu ra chương trình chỉ rõ:
- Ngay khi phát hiện bit của cột `age` trong Null Bitmap được bật (`1`), Engine Evaluator lập tức kích hoạt cơ chế ngắt mạch so sánh (short-circuit) và trả về `UNKNOWN`, hoàn toàn bỏ qua dữ liệu byte thô trong ô nhớ.
- Dẫn đến việc cả 2 phép so sánh trên đều thất bại âm thầm (không báo lỗi nhưng không trả về dòng dữ liệu mong muốn).

## Step 4: Khắc phục & Tối ưu (Resolution & Optimization)
Sử dụng toán tử trạng thái `IS NULL` để kiểm tra trạng thái vật lý của Null Bitmap:
- Phép toán `IS NULL` chỉ đọc byte Null Bitmap ở đầu dòng, thực hiện toán tử bitwise cực nhanh để trả về trực tiếp `TRUE`/`FALSE` mà không cần đọc vùng dữ liệu thô hay nạp vào CPU register để so sánh.

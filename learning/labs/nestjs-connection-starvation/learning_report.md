# [LEARNING REPORT] - CONNECTION POOL STARVATION IN NESTJS WITH TYPEORM
*   **Version:** 1.0.0 (Cập nhật gần nhất: 2026-05-22 23:25)
*   **Trạng thái:** Đang thực hành / Đang kiểm chứng

## I. Tại sao cần giải quyết bài toán Connection Pool Starvation?
Trong ứng dụng NestJS sử dụng TypeORM kết nối PostgreSQL/MySQL, khi tải cao (high concurrency), nếu không cấu hình Connection Pool đúng cách hoặc gặp lỗi rò rỉ kết nối (connection leak), các luồng xử lý sẽ chiếm dụng hết số lượng kết nối tối đa cho phép. Các request mới đến sẽ phải xếp hàng chờ kết nối được giải phóng. Nếu thời gian chờ vượt quá giới hạn (`connectionTimeout`), hệ thống sẽ trả về lỗi nghẽn kết nối (starvation) khiến toàn bộ API bị sập (gateway timeout), trong khi CPU và bộ nhớ hệ thống vẫn ở mức rất thấp.

Đây là sự cố kinh điển ở các dự án scale từ trung bình lên lớn, khi nhà phát triển chỉ quan tâm đến logic code mà quên đi giới hạn vật lý của kết nối database.

## II. Bản chất kỹ thuật & Cơ chế nội tại
Khi NestJS khởi chạy, TypeORM Driver sẽ khởi tạo một Connection Pool (bể chứa kết nối). 
- Khi một câu lệnh Query chạy: Client rút 1 kết nối ra khỏi pool -> thực thi -> trả kết nối lại pool.
- Nếu gặp lỗi rò rỉ: Query chưa hoàn tất do transaction bị block, hoặc quên không đóng EntityManager/QueryRunner thủ công, kết nối bị giữ vĩnh viễn và không bao giờ quay lại pool.

### Luồng dữ liệu nghẽn:
```
Request ──▶ Router ──▶ Service (Rút connection từ Pool) ──▶ Lỗi/Block (Giữ luôn connection)
Request ──▶ Router ──▶ Service (Pool rỗng) ──▶ Đợi (Queue) ──▶ ConnectionTimeoutError (Sập API)
```

## III. Tranh luận & Đánh đổi (Trade-offs)
Quyết định kiến trúc: **Nâng số lượng `max` connection pool lên cao (ví dụ max: 100) hay tối ưu hóa thời gian timeout và truy vấn?**

Chúng ta chấm điểm định lượng hai phương án này:

| Tiêu chí | Phương án A: Tăng Max Pool (100) | Phương án B: Giữ Max Pool vừa phải (20) & Tối ưu Timeout | Trọng số (1-5) | Điểm A | Điểm B |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Tiết kiệm RAM cho Database | 1 | 5 | 4 | 4 | 20 |
| Khả năng chịu tải đột biến (Burst) | 5 | 3 | 5 | 25 | 15 |
| Tránh nghẽn hàng đợi (Queue Lockout) | 2 | 4 | 4 | 8 | 16 |
| Khả năng chống chịu lỗi leak | 1 | 4 | 3 | 3 | 12 |
| **Tổng điểm** | | | | **40** | **63** |

*Kết luận của chúng ta:* Việc tăng max pool chỉ là giải pháp tình thế và gây tốn bộ nhớ vô ích cho PostgreSQL (mỗi kết nối trong Postgres tiêu tốn khoảng 10MB RAM). Phương án tối ưu nhất là giữ `max: 20-30` kết nối kết hợp cấu hình `acquireTimeoutMillis: 5000` (timeout lấy kết nối) và kiểm tra triệt để mã nguồn tránh leak.

## IV. Tự kiểm điểm (Post-Mortem & Reflection)
*   **Lỗ hổng tư duy ban đầu của Dev:** Dev có xu hướng nghĩ rằng tăng `max` connection pool là giải pháp tốt nhất khi tải cao mà không tính toán tài nguyên RAM bị chiếm dụng trên database server (PostgreSQL tạo 1 process cho mỗi connection).
*   **Điểm AI cần cải thiện:** Cần chỉ ra rõ hơn các thông số giám sát (như bảng `pg_stat_activity` trong Postgres) sớm hơn để Dev dễ hình dung trạng thái kết nối.

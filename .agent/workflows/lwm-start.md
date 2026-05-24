---
description: Bắt đầu phiên học thực chứng mới với learn-with-me skill
---

Kích hoạt kỹ năng học tập thực chứng `learn-with-me`.

**Input**: Bắt buộc phải cung cấp `<keyword>` — từ khóa kỹ thuật muốn học (ví dụ: `/lwm-start TypeORM QueryRunner`).

**Steps**

1. **Xác nhận keyword**

   Nếu `<keyword>` được cung cấp, sử dụng ngay.
   Nếu không có keyword, hỏi người dùng: *"Bạn muốn học từ khóa kỹ thuật nào trong phiên học này?"*

   Thông báo: `"Bắt đầu phiên học: <keyword>"` và nhắc lệnh kết thúc: `/lwm-end`.

2. **Đọc hồ sơ học tập**

   Dùng tool `read_file` để đọc file:
   `c:/ai-projects/my-porfolio/portfolio/.agent/skills/learn-with-me/learning_profile.json`

   Phân tích:
   - `weak_points` → ưu tiên khai thác trong phiên này
   - `mastered_topics` → bỏ qua, không hỏi lại
   - Kiểm tra xem keyword hiện tại có giao nhau với `weak_points` không → gắn cờ nếu có

3. **Thông báo trạng thái phiên (ngắn gọn, không quá 3 dòng)**

   ```
   📚 Phiên học: <keyword>
   ⚠️  Điểm yếu liên quan: <weak_point nếu có, hoặc "Không có">
   💡 Gõ /lwm-end để kết thúc và lưu báo cáo.
   ```

4. **Thực thi phiên học theo SKILL.md**

   Đọc file skill tại:
   `c:/ai-projects/my-porfolio/portfolio/.agent/skills/learn-with-me/SKILL.md`

   Thực thi đầy đủ quy trình Giai đoạn 1 → 4, tuân thủ toàn bộ THE STANCE và ADAPTIVE QUESTIONING.

**Guardrails**
- Không bắt đầu phiên học khi không có keyword rõ ràng
- Luôn đọc `learning_profile.json` trước khi hỏi câu đầu tiên
- Không tự động kết xuất báo cáo — chỉ thực hiện khi nhận lệnh `/lwm-end`
- Tuân thủ nghiêm ngặt bản cam kết hành vi: không nịnh bợ, không dông dài

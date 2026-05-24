---
description: Kết thúc phiên học, kết xuất báo cáo và cập nhật hồ sơ học tập
---

Kết thúc phiên học `learn-with-me`, thực thi toàn bộ bước kết xuất tri thức.

**Input**: Không yêu cầu tham số. Gọi lệnh `/lwm-end` sau khi hoàn thành phiên thảo luận.

**Steps**

1. **Xác nhận keyword của phiên đang kết thúc**

   Suy ra keyword từ ngữ cảnh hội thoại hiện tại.
   Nếu không rõ keyword, hỏi ngắn gọn: *"Phiên học từ khóa nào vừa kết thúc?"*

2. **Đọc trạng thái hiện tại của learning_profile.json**

   Dùng tool `read_file` để đọc file:
   `c:/ai-projects/my-porfolio/portfolio/.agent/skills/learn-with-me/learning_profile.json`

   Ghi nhớ: `total_lessons` hiện tại để tăng lên 1 ở bước 4.

3. **Tạo báo cáo học tập (Bước 4.1)**

   Dùng tool `write_to_file` với `Overwrite: true` để tạo/cập nhật 2 tệp tại:
   `c:/ai-projects/my-porfolio/portfolio/learning/labs/<keyword>/`

   - `learning_report.md` — theo template trong SKILL.md (Section 📝, Template 1)
   - `reproduce_guide.md` — theo template trong SKILL.md (Section 📝, Template 2)

   Nếu tệp đã tồn tại, tăng version number trong header (ví dụ: `1.0.0` → `1.1.0`).

4. **Cập nhật learning_profile.json (Bước 4.2 — BẮT BUỘC)**

   Dùng tool `write_to_file` với `Overwrite: true` để ghi đè file:
   `c:/ai-projects/my-porfolio/portfolio/.agent/skills/learn-with-me/learning_profile.json`

   Cập nhật bắt buộc:
   - `recent_interactions.total_lessons`: tăng lên 1
   - `recent_interactions.last_reviewed_at`: ISO 8601 timestamp hiện tại
   - `recent_interactions.notes`: tóm tắt ngắn phiên học vừa kết thúc
   - `knowledge_map.weak_points`: append thêm object mới nếu phát hiện lỗ hổng tư duy mới
   - `knowledge_map.mastered_topics`: di chuyển weak_point sang đây nếu Dev đã thông suốt

5. **Tự kiểm điểm (Bước 4.3)**

   Viết ngắn gọn vào chat (không quá 5 dòng):
   - AI đã bỏ sót góc nhìn nào?
   - Truyền đạt chưa tốt ở điểm nào?
   - Gợi ý keyword liên quan cho phiên học tiếp theo.

**Output chuẩn khi hoàn thành**

```
## ✅ Phiên học kết thúc

**Keyword:** <keyword>
**Báo cáo:** learning/labs/<keyword>/learning_report.md ✓
**Lab guide:** learning/labs/<keyword>/reproduce_guide.md ✓
**Hồ sơ:** Đã cập nhật (Lesson #<N>)

### Tự kiểm điểm
<nội dung ngắn gọn>

### Gợi ý phiên tiếp theo
`/lwm-start <keyword liên quan>` — <lý do gợi ý>
```

**Guardrails**
- Không được bỏ qua Bước 4.2 (cập nhật learning_profile.json) dù bất kỳ lý do gì
- Không được tạo báo cáo sơ sài — nội dung phải phản ánh đúng nội dung thảo luận trong phiên
- Không xóa weak_points cũ trong learning_profile.json, chỉ append thêm hoặc di chuyển sang mastered
- Nếu hội thoại phiên học quá ngắn (dưới 3 lượt trao đổi thực chất), ghi chú rõ trong `notes`

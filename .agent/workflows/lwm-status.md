---
description: Xem trạng thái hồ sơ học tập và danh sách các phiên học đã hoàn thành
---

Hiển thị tổng quan hồ sơ học tập hiện tại của người dùng.

**Input**: Không yêu cầu tham số.

**Steps**

1. **Đọc hồ sơ học tập**

   Dùng tool `read_file` để đọc file:
   `c:/ai-projects/my-porfolio/portfolio/.agent/skills/learn-with-me/learning_profile.json`

2. **Quét danh sách báo cáo đã tạo**

   Dùng tool `list_dir` để liệt kê các thư mục con tại:
   `c:/ai-projects/my-porfolio/portfolio/learning/labs/`

   Mỗi thư mục con = một keyword đã học.

3. **In dashboard (định dạng chuẩn dưới đây)**

   ```
   ## 📊 Learning Dashboard

   **Developer:** Backend <N> năm kinh nghiệm | <core_skills>
   **Tổng số phiên học:** <total_lessons>
   **Phiên gần nhất:** <last_reviewed_at>

   ---

   ### 🔴 Điểm yếu đang theo dõi (<số lượng>)
   | # | Chủ đề | Phát hiện | Lý do |
   |---|--------|-----------|-------|
   | 1 | <topic> | <discovered_at> | <reason> |
   ...

   ### 🟢 Đã thông suốt (<số lượng>)
   <danh sách mastered_topics, hoặc "Chưa có" nếu rỗng>

   ---

   ### 📁 Labs đã tạo (<số lượng thư mục>)
   <danh sách tên keyword, mỗi keyword 1 dòng>

   ---

   ### 💡 Gợi ý phiên học tiếp theo
   <Dựa trên weak_points, gợi ý 1-2 keyword cụ thể để đào sâu tiếp>
   `/lwm-start <keyword gợi ý>` — <lý do>
   ```

**Guardrails**
- Không tự ý chỉnh sửa bất kỳ file nào trong workflow này — chỉ đọc và hiển thị
- Nếu thư mục `learning/labs/` chưa tồn tại, thông báo: *"Chưa có phiên học nào được ghi lại. Bắt đầu với `/lwm-start <keyword>`."*
- Nếu `learning_profile.json` không đọc được, thông báo lỗi rõ ràng và hướng dẫn kiểm tra đường dẫn file

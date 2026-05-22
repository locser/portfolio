## ADDED Requirements

### Requirement: Dark and Light Theme Support in Blog Pages
Trang danh sách bài viết (`/blog`) và trang chi tiết bài viết (`/blog/[slug]`) SHALL tự động thay đổi màu nền, màu chữ và màu các viền/nút bấm tương ứng khi người dùng click vào nút ThemeToggle (Light/Dark mode) thông qua việc đồng bộ với thư viện `next-themes`.

#### Scenario: Toggling theme to Light mode in Blog list
- **WHEN** người dùng nhấn vào nút chuyển đổi theme (ThemeToggle) trên header trang `/blog` khi đang ở Dark mode
- **THEN** giao diện trang blog SHALL chuyển sang Light mode, với nền sáng (ví dụ: `bg-white` hoặc `bg-zinc-50`) và chữ tối màu (ví dụ: `text-zinc-900` hoặc `text-zinc-800`), đồng thời các card bài viết cũng được cập nhật màu nền sáng rõ rệt.

#### Scenario: Toggling theme to Dark mode in Blog detail page
- **WHEN** người dùng nhấn vào nút chuyển đổi theme trên header trang chi tiết bài viết `/blog/xxx` khi đang ở Light mode
- **THEN** giao diện trang chi tiết SHALL chuyển sang Dark mode, với nền tối (ví dụ: `bg-black-100` hoặc `bg-zinc-950`) và chữ sáng màu (ví dụ: `text-zinc-300` hoặc `text-white`), các thẻ blockquote và code blocks được định dạng tối màu tối ưu.

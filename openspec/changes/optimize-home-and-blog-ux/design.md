## Context

- Trang chủ hiện tại (`src/app/page.tsx`) tích hợp rất nhiều section dài: Hero, Projects, Experience, TechStack, Blog, Contact, Footer khiến chiều dài cuộn trang quá lớn, người dùng phải lướt rất lâu và phần Blog bị chìm xuống dưới cùng, không thu hút được sự chú ý.
- Trang danh sách Blog (`src/app/blog/BlogClient.tsx`) và trang chi tiết bài viết (`src/app/blog/[slug]/page.tsx`) bị hardcode các class nền đen đục (`bg-black-100`, `bg-[#0a0a0a]`, `bg-[#050505]`) và chữ trắng/xám sáng, dẫn đến việc không phản hồi khi người dùng bấm vào nút chuyển đổi giao diện (ThemeToggle - sử dụng `next-themes` để bật/tắt class `dark` trên thẻ HTML).
- Sticky Header của trang Blog đang dùng màu nền `bg-black/30 backdrop-blur-md border-b border-zinc-900` có độ mờ quá lớn (trong suốt 70%) và ranh giới viền dưới quá tối, làm cho khi cuộn trang, chữ và hình ảnh của bài viết đi qua Header bị lẫn lộn vào nhau, rất khó đọc và không phân biệt được Header ở đâu.
- Trang chi tiết bài viết `/blog/[slug]` chưa hiển thị danh sách các tag bài viết ở phần đầu trang, mặc dù dữ liệu frontmatter đã có sẵn `tags` trong mảng dữ liệu.

## Goals / Non-Goals

**Goals:**
- Tối ưu bố cục trang chủ: Đưa Blog lên ngay sau Projects (và trước Experience). Rút gọn khoảng cách đệm (padding) và làm gọn kích thước của Experience và TechStack để trang ngắn gọn, súc tích hơn.
- Áp dụng hoàn toàn hỗ trợ chuyển đổi Light/Dark mode trên toàn bộ trang `/blog` và `/blog/[slug]`. Sử dụng các tiền tố `dark:` kết hợp màu sắc tương phản rõ ràng (ví dụ: Light mode nền sáng `bg-zinc-50`, chữ tối `text-zinc-800`; Dark mode nền tối `bg-black-100`, chữ sáng `text-zinc-300`).
- Thiết kế lại Header điều hướng cố định: Tăng độ đục của nền lên `bg-white/80 dark:bg-black/80` (hoặc `bg-zinc-50/90 dark:bg-[#050505]/90`), tăng độ nổi bật của viền dưới và thêm bóng đổ nhẹ `shadow-sm` khi cuộn trang để phân định rõ ràng ranh giới cố định của Header.
- Kết xuất danh sách tags của bài viết dưới dạng các badge/pill bắt mắt đặt ngay bên dưới tiêu đề ở đầu trang `/blog/[slug]`.

**Non-Goals:**
- Không sửa đổi cấu trúc dữ liệu hoặc file markdown của các bài viết.
- Không thay đổi chức năng cốt lõi của `next-themes` và `ThemeToggle`.
- Không thay đổi các trang không liên quan trực tiếp (như trang About).

## Decisions

### 1. Tái cấu trúc bố cục trang chủ (Home Page)
- **Quyết định**: Thay đổi thứ tự import và render trong `src/app/page.tsx`:
  - Hiện tại: `Hero` -> `Projects` -> `Experience` -> `TechStack` -> `Blog` -> `Contact` -> `Footer`
  - Đề xuất: `Hero` -> `Projects` -> `Blog` -> `Experience` -> `TechStack` -> `Contact` -> `Footer`
- **Rút gọn các section Experience & TechStack**:
  - Giảm padding trục Y trong `src/components/Experience.tsx` và `src/components/TechStack.tsx` từ `py-24` hoặc `py-20` xuống còn `py-12` hoặc `py-16`.
  - Tinh chỉnh khoảng cách giữa các element để chúng khít hơn, giảm chiều dài cuộn.

### 2. Tích hợp Light/Dark Mode cho trang Blog và trang chi tiết bài viết
- **Quyết định**: Thay đổi các class tĩnh thành class đáp ứng Light/Dark mode:
  - **Trang danh sách Blog (`BlogClient.tsx`)**:
    - Nền chính: `bg-black-100` -> `bg-zinc-50 dark:bg-black-100`
    - Chữ chính: `text-white` -> `text-zinc-900 dark:text-white`
    - Khối tìm kiếm & Nút tag: Thay đổi nền `bg-[#0a0a0a]` -> `bg-white dark:bg-[#0a0a0a]`, viền `border-zinc-800` -> `border-zinc-200 dark:border-zinc-800`
    - Card bài viết: Thay đổi nền `bg-[#0a0a0a] border-zinc-900` -> `bg-white dark:bg-[#0a0a0a] border-zinc-250 dark:border-zinc-900 shadow-sm dark:shadow-none hover:border-zinc-400 dark:hover:border-zinc-800`
  - **Trang chi tiết bài viết (`[slug]/page.tsx`)**:
    - Áp dụng các thay đổi tương tự cho Container chính và Footer.
    - Cập nhật các component custom MDX (h2, h3, p, ul, ol, a, pre, blockquote): thay đổi màu chữ `text-zinc-400` -> `text-zinc-650 dark:text-zinc-400`, màu tiêu đề `text-white` -> `text-zinc-900 dark:text-white`, blockquote `bg-zinc-950/30` -> `bg-zinc-100 dark:bg-zinc-950/30`.
- **Giải pháp thay thế**: Sử dụng CSS variables động. Tuy nhiên, việc áp dụng các lớp tiện ích `dark:` của Tailwind mang lại sự nhất quán, trực quan và dễ bảo trì hơn vì Next.js đang dùng cấu hình Tailwind chuẩn.

### 3. Nâng cấp sticky Header để phân biệt rõ rệt khi cuộn trang
- **Quyết định**: Thay đổi class của thẻ `<header>` tại cả hai trang Blog:
  - Class cũ: `bg-black/30 backdrop-blur-md border-b border-zinc-900`
  - Class mới: `bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-850 shadow-sm sticky top-0 z-50`
  - Đồng thời cập nhật màu chữ của các Link trong header để đổi màu khi chuyển theme (ví dụ: `text-zinc-800 dark:text-zinc-200`).

### 4. Kết xuất các Tag của bài viết ở đầu trang chi tiết
- **Quyết định**: Lấy mảng `post.tags` trong `src/app/blog/[slug]/page.tsx`. Trong thẻ `<header>` của bài viết, chèn một khối render tags ngay bên dưới tiêu đề (hoặc dưới thời gian đọc):
  ```tsx
  {post.tags && post.tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-4">
      {post.tags.map((tag) => (
        <span
          key={tag}
          className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-xs font-medium uppercase font-mono tracking-wider"
        >
          #{tag}
        </span>
      ))}
    </div>
  )}
  ```

## Risks / Trade-offs

- **[Risk] Hydration Mismatch do Theme Toggle**:
  - *Mô tả*: React hydration có thể xảy ra lỗi khi HTML tĩnh render trên máy chủ (server-side render) mang theme mặc định (dark) nhưng client lại ở theme khác (light) trước khi script chạy.
  - *Mitigation*: Sử dụng component `ThemeToggle` đã được xử lý hydration mismatch thông qua trạng thái `mounted`. Đối với các class màu sắc, cấu hình `attribute="class"` của `next-themes` sẽ tự động thêm class `dark` vào thẻ `html` ở giai đoạn đầu của vòng đời tải trang, giúp Tailwind CSS ánh xạ chính xác và tránh lỗi mismatch.
- **[Risk] Phông chữ và Độ tương phản**:
  - *Mô tả*: Khi chuyển sang Light mode, một số chữ màu xám nhạt (`text-zinc-500`) hoặc màu tối trên nền tối có thể bị mờ, không đủ độ tương phản WCAG AA.
  - *Mitigation*: Kiểm tra kỹ lưỡng bảng màu chuyển đổi, áp dụng `text-zinc-500` cho phần phụ trợ và `text-zinc-800` hoặc `text-zinc-900` cho phần chữ chính trong Light mode.

## Why

Trang chủ hiện tại quá dài và loãng với quá nhiều phần nội dung (Hero, Projects, Experience, TechStack, Blog, Contact, Footer) xếp chồng liên tiếp khiến người dùng phải cuộn trang quá nhiều và làm mờ nhạt đi thông tin về phần Blog. Ngoài ra, giao diện trang Blog và trang chi tiết bài viết đang bị lỗi không hỗ trợ chuyển đổi Light/Dark mode, header cố định bị trùng màu với nội dung bài viết khi cuộn gây khó khăn trong việc định vị giao diện, và thiếu hiển thị các thẻ tag bài viết ở đầu trang chi tiết để tăng tính định hướng và điều hướng.

## What Changes

- **Tối ưu hóa cấu trúc trang chủ**: 
  - Đưa phần Blog lên vị trí cao hơn, trực quan hơn hoặc thiết kế lại bố cục trang chủ gọn gàng hơn (ví dụ: dùng cấu trúc hiển thị dạng lưới cô đọng, tabs, hoặc rút gọn bớt thông tin chi tiết của Experience/TechStack thành các phần xem thêm/liên kết trang riêng biệt).
  - Thu ngắn chiều dài trang chủ để tạo sự chú ý tập trung vào hai nội dung cốt lõi: Projects nổi bật và Blog cá nhân.
- **Sửa lỗi Dark/Light Mode trên Blog**:
  - Hỗ trợ đổi theme động (Light/Dark mode) cho toàn bộ trang danh sách bài viết (`/blog`) và trang chi tiết bài viết (`/blog/[slug]`) thông qua việc tích hợp các class màu sắc đáp ứng của Tailwind CSS tương ứng với `next-themes`.
- **Nâng cấp Header điều hướng khi cuộn**:
  - Cải thiện CSS của Header cố định trên trang Blog để đảm bảo có màu nền tương phản rõ rệt hoặc độ mờ (backdrop opacity) cao hơn kèm theo hiệu ứng đổ bóng/đường viền tinh tế khi người dùng cuộn nội dung qua nó, giúp phân biệt rõ Header và nội dung.
- **Thêm hiển thị bài viết Tag ở đầu trang chi tiết**:
  - Hiển thị danh sách các tag bài viết ngay dưới tiêu đề và thời gian đọc ở đầu trang chi tiết bài viết (`/blog/[slug]`).

## Capabilities

### New Capabilities
- `home-page-reorganization`: Tái cấu trúc và tối ưu hóa giao diện trang chủ để giảm thiểu chiều dài cuộn trang và làm nổi bật phần Blog.
- `blog-theme-toggle-fix`: Tích hợp và sửa lỗi chuyển đổi Light/Dark mode trên trang danh sách blog và chi tiết bài viết.
- `blog-header-ui-distinction`: Thiết kế lại UI Header cố định của Blog nhằm tạo sự phân biệt rõ ràng với nội dung bài viết khi cuộn trang.
- `blog-tags-integration`: Thêm hiển thị danh sách các tags bài viết ở phần đầu trang chi tiết bài viết.

### Modified Capabilities
*(Không có spec cũ nào bị thay đổi)*

## Impact

- **Mã nguồn bị ảnh hưởng**:
  - `src/app/page.tsx`: Thay đổi thứ tự và cấu trúc hiển thị các section.
  - `src/app/blog/BlogClient.tsx`: Cập nhật class Tailwind hỗ trợ Light/Dark mode, điều chỉnh Header.
  - `src/app/blog/[slug]/page.tsx`: Cập nhật class hỗ trợ Light/Dark mode cho nội dung MDX và cấu trúc trang, sửa Header, thêm hiển thị tags ở phần đầu bài viết.
  - `src/components/ThemeToggle.tsx`: Đảm bảo tích hợp mượt mà.
- **Dependencies**: Không thêm dependencies mới, sử dụng sẵn `next-themes` và `tailwindcss` hiện tại.

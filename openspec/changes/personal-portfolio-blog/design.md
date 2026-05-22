## Context

Dự án hiện tại là một portfolio cá nhân được xây dựng trên **Next.js 14** (App Router), sử dụng **TypeScript**, **TailwindCSS**, và **Framer Motion** để tạo hiệu ứng chuyển động. Giao diện hiện tại hỗ trợ đa ngôn ngữ (i18next) và Light/Dark theme. 

Tuy nhiên, cấu trúc này chưa có tính năng Blog hoàn chỉnh và phong cách giao diện cần được điều chỉnh lại để trở nên giản dị hơn, ít màu sắc sặc sỡ và ít font chữ hơn, tập trung tối đa vào nội dung và trải nghiệm đọc của người dùng.

## Goals / Non-Goals

**Goals:**
- Tối giản hóa giao diện hiện có: Thiết lập duy nhất font chữ `Inter` (qua Next.js font) và bảng màu đơn sắc tinh tế (Trắng ngà, Đen than, và các sắc Xám nhẹ).
- Xây dựng **Blog Engine tĩnh** (Static Blog Engine) sử dụng file Markdown (`.md` hoặc `.mdx`) lưu trữ cục bộ trong thư mục dự án, được phân tích cú pháp tại thời điểm build (Build time) bằng `gray-matter` và hiển thị bằng `next-mdx-remote` hoặc một thư viện parser nhẹ.
- Phát triển trang danh sách blog `/blog` hỗ trợ tìm kiếm từ khóa và lọc theo tag trực tiếp trên Client-Side.
- Phát triển trang chi tiết blog `/blog/[slug]` với kiểu dáng typography tối giản, hỗ trợ mục lục tự động, ước tính thời gian đọc (reading time) và hiển thị code blocks đẹp mắt.
- Cập nhật trang `/about` hiển thị thông tin giới thiệu bản thân giản dị và trục thời gian (timeline) sự nghiệp/cuộc sống của tác giả.

**Non-Goals:**
- Không xây dựng hệ thống quản trị (Admin Dashboard) hay cơ sở dữ liệu để đăng bài trực tuyến. Mọi bài viết mới sẽ được thêm bằng cách tạo file Markdown trong repo Git và commit lên.
- Không yêu cầu người đọc phải đăng nhập hoặc đăng ký tài khoản để xem bất kỳ tài liệu hay nội dung nào trên trang web.
- Không sử dụng các dịch vụ CMS bên ngoài (như Strapi, Contentful, Sanity) để giữ dự án hoàn toàn miễn phí và không phụ thuộc vào bên thứ ba.

## Decisions

### Decision 1: Lựa chọn Local Markdown (MDX) làm nguồn lưu trữ bài viết
- **Phương án cân nhắc:** Sử dụng Headless CMS bên ngoài (ví dụ: Sanity, Strapi).
- **Quyết định:** Sử dụng local Markdown (`src/data/posts/*.md`) kết hợp với `gray-matter` để đọc front-matter và `next-mdx-remote` để render nội dung.
- **Lý do lựa chọn:**
  - **Tốc độ:** Tải trang cực nhanh nhờ khả năng Static Site Generation (SSG) của Next.js.
  - **Miễn phí hoàn toàn:** Không tốn chi phí lưu trữ database hay tài khoản CMS.
  - **Bảo mật & Backup:** Bài viết được lưu trữ và phiên bản hóa (version controlled) trực tiếp trong kho Git cùng với mã nguồn.
  - **Đơn giản:** Phù hợp hoàn hảo với tiêu chí giản dị, dễ bảo trì lâu dài.

### Decision 2: Thực hiện Tìm kiếm & Lọc bài viết ở Client-Side
- **Phương án cân nhắc:** Sử dụng các công cụ tìm kiếm bên thứ ba (như Algolia) hoặc tạo API tìm kiếm động ở Server-Side.
- **Quyết định:** Tải trước (Prefetch) danh sách siêu dữ liệu (metadata) của tất cả bài viết từ front-matter và thực hiện tìm kiếm, lọc theo tag ngay trên trình duyệt (Client-Side).
- **Lý do lựa chọn:**
  - Với số lượng bài viết dưới 1,000 bài của một blog cá nhân, việc tìm kiếm và lọc trên Client-Side xảy ra gần như tức thì (< 10ms) mà không tạo thêm bất kỳ request mạng nào lên server.
  - Không cần thiết lập thêm thư viện tìm kiếm nặng nề hay trả phí.

### Decision 3: Hệ thống Design System & Typography Tối Giản
- **Phương án cân nhắc:** Sử dụng nhiều font chữ khác nhau cho Heading (Serif) và Body (Sans-serif), sử dụng bảng màu tươi sáng.
- **Quyết định:** Chỉ sử dụng duy nhất font chữ `Inter` (hoặc font sans-serif hệ thống) cho toàn bộ trang web. Sử dụng bảng màu đơn sắc (Monochromatic) với chủ đạo là xám sẫm (Slate/Zinc) kết hợp trắng ngà, loại bỏ hoàn toàn các màu nhấn quá nổi bật như xanh neon, đỏ tươi hay tím hồng.
- **Lý do lựa chọn:**
  - Giảm thiểu sự phân tâm của người đọc, tạo cảm giác yên bình, giản dị, thư thái khi đọc blog.
  - Tối ưu hóa kích thước tải trang do không cần tải nhiều file font chữ khác nhau.

### Decision 4: Giải pháp tìm bài viết gợi ý và chuyển hướng trước/sau tĩnh (Static Next/Prev & Suggested Posts)
- **Phương án cân nhắc:** Lấy danh sách bài viết từ client-side qua API, sau đó so sánh và hiển thị các bài viết liên quan.
- **Quyết định:** Tính toán danh sách 2-3 bài viết gợi ý (dựa trên số lượng tags trùng lặp nhiều nhất) và các bài viết kề cận (Next/Previous Post dựa trên ngày đăng) ngay tại thời điểm build/render ở Server-Side (SSG/ISR) trong `src/app/blog/[slug]/page.tsx`.
- **Lý do lựa chọn:**
  - Tránh hoàn toàn việc gọi API hay tính toán phức tạp ở trình duyệt client, giảm lag.
  - Tăng tốc độ load trang do HTML render sẵn đã chứa đầy đủ link của các bài viết gợi ý và Next/Prev.
  - Cải thiện SEO rất lớn nhờ liên kết nội bộ (internal linking) tĩnh vững chắc.

### Decision 5: Kỹ thuật đảm bảo hiệu năng cuộn mượt mà (60 FPS) & Giảm thiểu Client Storage
- **Phương án cân nhắc:** Sử dụng các thư viện cuộn mượt (như Locomotive Scroll hay Smooth Scroll JS) và các thư viện quản lý state client (Redux, Zustand) để lưu trữ mọi thứ.
- **Quyết định:** 
  1. Chỉ sử dụng thuộc tính CSS thuần `scroll-behavior: smooth` để cuộn trang mượt mà tự nhiên bằng phần cứng.
  2. Sử dụng các animation đơn giản của Framer Motion với thuộc tính phần cứng hỗ trợ (transform, opacity) và kích hoạt `will-change` khi cần, tránh làm trình duyệt repaint liên tục.
  3. Sử dụng component `next/image` để tự động tối ưu hóa dung lượng hình ảnh, lazy loading mặc định, tránh việc tải ảnh quá nặng gây giật lag (stuttering).
  4. Hạn chế tối đa việc ghi dữ liệu vào LocalStorage (chỉ dùng duy nhất `next-themes` lưu trữ trạng thái Light/Dark nhẹ nhàng dưới 1 byte), không lưu cache bài viết cồng kềnh trên client-side.
- **Lý do lựa chọn:**
  - Loại bỏ hoàn toàn các thư viện JS scroll cồng kềnh giúp giảm kích thước bundle size, giảm thiểu CPU usage trên các thiết bị cấu hình thấp.
  - Tránh rò rỉ bộ nhớ (memory leaks) và đảm bảo trang web phản hồi tức thì với tốc độ 60 FPS ổn định.

## Risks / Trade-offs

- **[Risk] Thêm bài đăng mới yêu cầu redeploy trang web** → *Mitigation:* Với các nền tảng hosting hiện đại như Vercel hoặc Netlify, quá trình deploy diễn ra hoàn toàn tự động khi push code lên nhánh chính và chỉ mất chưa đầy 1 phút. Quá trình này không gây gián đoạn dịch vụ cho người dùng (Zero-downtime deployment).
- **[Risk] Lỗi cú pháp trong file Markdown làm sập trang build** → *Mitigation:* Viết một hàm helper đọc file Markdown có tích hợp try-catch, bỏ qua các bài viết bị lỗi cú pháp hoặc hiển thị cảnh báo rõ ràng ở môi trường development thay vì làm sập toàn bộ ứng dụng.


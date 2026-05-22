# BÁO CÁO HỌC TẬP & CÔNG VIỆC HÀNG NGÀY (DAILY REPORT)
**Ngày thực hiện:** 22/05/2026  
**Chủ đề:** Nghiên cứu kiến trúc DevOps & Thiết lập Hạ tầng deploy Next.js lên Ubuntu Server qua VPN  

---

## I. NHỮNG GÌ ĐÃ HỌC ĐƯỢC HÔM NAY (KNOWLEDGE GAINED)

### 1. Kiến thức về Coolify & Self-hosted PaaS
- Hiểu được định nghĩa và lý do Coolify trở thành giải pháp thay thế mã nguồn mở tối ưu cho Heroku, Vercel, Railway.
- Nắm bắt mô hình kiến trúc hoạt động:
  - **Traefik Reverse Proxy:** Tự động điều phối traffic, nhận diện các container mới và quản lý chứng chỉ SSL tự động.
  - **Nixpacks Engine:** Tự động phát hiện ngôn ngữ/khung chương trình (như Next.js) để đóng gói thành container mà không cần viết file Dockerfile thủ công.
  - **Docker Containerization:** Đảm bảo tính cô lập và bảo mật cao cho các ứng dụng trên cùng một máy chủ.

### 2. Kiến thức về CI/CD trong Doanh nghiệp (Enterprise Standards)
- **Hệ sinh thái All-in-One:** Ưu và nhược điểm của GitHub Actions (Enterprise) và GitLab CI/CD trong việc quản trị code tập trung và DevSecOps.
- **Mô hình GitOps:** Cách các doanh nghiệp sử dụng **Argo CD / Flux CD** để đồng bộ tự động trạng thái ứng dụng trên Kubernetes trực tiếp từ mã nguồn Git (Single Source of Truth).
- **Jenkins:** Vai trò của Jenkins trong việc xử lý các pipeline cũ, phức tạp và cần khả năng tùy biến vô hạn.

### 3. Tư duy Giải quyết Bài toán VPN & Bảo mật
- Hiểu giải pháp kết nối **Outbound-only** sử dụng **Self-Hosted Runner**: Thay vì mở cổng mạng từ ngoài vào (rất nguy hiểm và khó khăn khi ở sau mạng VPN), runner cài trên server nội bộ sẽ tự động kết nối kéo công việc từ GitHub xuống một cách chủ động và cực kỳ an toàn.

---

## II. NHỮNG GÌ ĐÃ LÀM ĐƯỢC HÔM NAY (DELIVERABLES COMPLETED)

### 1. Khởi tạo quy trình OpenSpec Change
- Tạo thành công Change Proposal mang tên `deploy-portfolio-ubuntu-vpn` để theo dõi toàn bộ đặc tả thiết kế hệ thống.
- Hoàn thiện đầy đủ các hồ sơ thiết kế: `proposal.md`, `design.md`, `specs/spec.md`, và danh sách nhiệm vụ tổng quan `tasks.md`.

### 2. Thiết lập cấu hình CI/CD tự động (Local)
- Viết thành công file cấu hình pipeline **[.github/workflows/deploy.yml](file:///c:/ai-projects/my-porfolio/portfolio/.github/workflows/deploy.yml)** để tự động kiểm thử, build Next.js thành phẩm và kích hoạt webhook gửi lệnh deploy tới Coolify.

### 3. Xuất bản Tài liệu Thực hành Kỹ thuật
- Soạn thảo cẩm nang thực hành chi tiết **[docs/devops-setup-guide.md](file:///c:/ai-projects/my-porfolio/portfolio/docs/devops-setup-guide.md)** bằng tiếng Việt với toàn bộ mã lệnh copy-paste để thiết lập Swap Space, cài đặt Coolify và khởi chạy Git Runner thành service hệ thống ngầm.

---

## III. KẾ HOẠCH CÔNG VIỆC HÀ HÀNG NGÀY TIẾP THEO (DAILY TASKS FOR YOU)

Dưới đây là danh sách các bước bạn sẽ trực tiếp thực hiện trên server của mình theo lộ trình hàng ngày để hoàn tất việc học tập và cấu hình DevOps:

### 📅 Ngày 1: Chuẩn bị Server & Cài đặt PaaS (Coolify)
- [ ] **Task 1.1:** Truy cập VPN và SSH vào server Ubuntu (`ssh username@ip_server`).
- [ ] **Task 1.2:** Chạy lệnh kích hoạt **4GB Swap Space** theo hướng dẫn để tránh bị đứng RAM khi build Next.js.
- [ ] **Task 1.3:** Cài đặt Coolify bằng lệnh `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`.
- [ ] **Task 1.4:** Truy cập `http://<IP_Server>:8000` trên trình duyệt để khởi tạo tài khoản quản trị Coolify.

### 📅 Ngày 2: Cài đặt Runner & Liên kết GitHub
- [ ] **Task 2.1:** Tạo một user hệ thống mới tên là `github-runner` trên Ubuntu để đảm bảo bảo mật.
- [ ] **Task 2.2:** Đăng nhập vào user `github-runner`, tải gói Runner và giải nén.
- [ ] **Task 2.3:** Lấy token cấu hình trên GitHub Repo của bạn để liên kết Runner (chạy lệnh `./config.sh`).
- [ ] **Task 2.4:** Đóng gói và chạy Runner dưới dạng Systemd service (`sudo ./svc.sh install && sudo ./svc.sh start`).
- [ ] **Task 2.5:** Xác nhận trạng thái Runner chuyển sang màu xanh **Active/Idle** trên trang GitHub Settings.

### 📅 Ngày 3: Tích hợp Pipeline & Kiểm thử
- [ ] **Task 3.1:** Liên kết Git repository của bạn trên Coolify để tạo ứng dụng Next.js mới.
- [ ] **Task 3.2:** Lấy đường dẫn **Deploy Webhook URL** từ ứng dụng trong Coolify.
- [ ] **Task 3.3:** Đưa đường dẫn Webhook này vào phần cấu hình bảo mật **GitHub Secrets** với tên `COOLIFY_DEPLOY_WEBHOOK`.
- [ ] **Task 3.4:** Chạy thử bằng cách đẩy một commit mới lên nhánh `main` và theo dõi pipeline tự động build, test và ra lệnh deploy sang Coolify!
- [ ] **Task 3.5:** Sửa file cấu hình hosts của máy cá nhân để trỏ domain `portfolio.local` về IP server của bạn và tận hưởng kết quả.

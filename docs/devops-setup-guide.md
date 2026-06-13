# Hướng dẫn chi tiết triển khai DevOps cho Next.js Portfolio trên Server Ubuntu Private (VPN)

Tài liệu này cung cấp toàn bộ các câu lệnh thực tế, cấu hình và chỉ dẫn từng bước để bạn tự tay thiết lập hạ tầng **Coolify PaaS** và **GitHub Actions Self-Hosted Runner** trên server Ubuntu nội bộ của mình.

---

## BẢN ĐỒ KIẾN TRÚC HỆ THỐNG
```
[ Máy tính của bạn (đã bật VPN) ]
               │
               ├─► Truy cập Coolify Dashboard: http://<ip-ubuntu-vpn>:8000
               └─► Xem sản phẩm Portfolio: http://portfolio.local
               
[ Server Ubuntu (trong mạng VPN) ]
 ├── GitHub Actions Runner (Systemd Service) ──(Outbound HTTPS)──► GitHub Cloud
 └── Coolify Management Plane (Docker)
      └── Traefik Reverse Proxy ──► Next.js App Container (port 3000)
```

---

## PHẦN 1: Cấu hình Server Ubuntu & Cài đặt Coolify

Hãy kết nối VPN trên máy tính của bạn, mở terminal và SSH vào server Ubuntu:
```bash
ssh username@<IP_SERVER_UBUNTU_VPN>
```

### Bước 1.1: Cập nhật hệ thống
Cập nhật danh sách các package mới nhất từ repo của Ubuntu:
```bash
sudo apt update && sudo apt upgrade -y
```

### Bước 1.2: Kích hoạt Swap Space (Cực kỳ quan trọng)
Next.js khi build sản phẩm (production bundle) sử dụng trình biên dịch SWC bằng Rust, tiêu tốn rất nhiều RAM (có thể lên tới 2GB - 3GB). Nếu VPS/Server của bạn chỉ có 1GB - 2GB RAM, quá trình build sẽ bị đứng (frozen) hoặc lỗi `Out of Memory`.

Chạy các lệnh sau để tạo **4GB Swap** giúp server chạy ổn định hơn:
```bash
# 1. Tạo file swap kích thước 4GB
sudo fallocate -l 4G /swapfile

# Nếu lệnh trên bị lỗi hoặc không được hỗ trợ trên phân vùng của bạn, dùng lệnh alternative sau:
# sudo dd if=/dev/zero of=/swapfile bs=1M count=4096

# 2. Phân quyền chỉ cho phép root đọc/ghi file này
sudo chmod 600 /swapfile

# 3. Định dạng file thành không gian Swap
sudo mkswap /swapfile

# 4. Kích hoạt Swap ngay lập tức
sudo swapon /swapfile

# 5. Đảm bảo Swap tự động kích hoạt mỗi khi khởi động lại Server
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Kiểm tra lại xem Swap đã nhận chưa
free -h
```

### Bước 1.3: Cài đặt Coolify
Coolify cung cấp một script cài đặt tự động hóa toàn bộ quá trình tải Docker Engine, cấu hình tường lửa và thiết lập Dashboard:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
> **Thời gian chờ:** Khoảng 3 - 5 phút tùy thuộc vào tốc độ mạng của server. Sau khi hoàn tất, màn hình sẽ hiển thị thông báo Coolify đã chạy thành công.

### Bước 1.4: Khởi tạo tài khoản Coolify Admin
1. Mở trình duyệt trên máy tính của bạn (đã kết nối VPN).
2. Truy cập vào địa chỉ: `http://<IP_SERVER_UBUNTU_VPN>:8000`
3. Đăng ký tài khoản Admin đầu tiên (đây sẽ là tài khoản quản trị tối cao của bạn).
4. Tạo một **Project** mới tên là `portfolio` và chọn môi trường `production`.

---

## PHẦN 2: Thiết lập GitHub Self-Hosted Runner trên Server

Vì server của bạn nằm sau VPN, các máy chủ của GitHub không thể gửi tín hiệu trực tiếp (webhook/SSH) đến server của bạn. Do đó, ta cài đặt một ứng dụng Runner ngay trên server để nó liên tục "lắng nghe" và "kéo" các công việc build từ GitHub về.

### Bước 2.1: Tạo User chuyên biệt cho Runner (Tăng tính bảo mật)
Không nên chạy Runner bằng quyền root. Hãy tạo một user riêng:
```bash
# Tạo user mới tên là github-runner
sudo adduser --disabled-password --gecos "" github-runner

# Thêm user này vào group docker để có quyền thao tác với container
sudo usermod -aG docker github-runner

# Chuyển sang đăng nhập bằng user mới tạo
sudo su - github-runner
```

### Bước 2.2: Tải và giải nén Runner
Truy cập kho GitHub của bạn trên trình duyệt: **Settings -> Actions -> Runners -> New self-hosted runner**. Chọn hệ điều hành **Linux** và kiến trúc **x64**. 

Copy các lệnh tải từ trang GitHub đó và chạy trên server (dưới quyền user `github-runner`):
```bash
# 1. Tạo thư mục làm việc
mkdir actions-runner && cd actions-runner

# 2. Tải runner package (Ví dụ phiên bản v2.316.1 - kiểm tra link mới nhất trên GitHub của bạn)
curl -o actions-runner-linux-x64-2.316.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.316.1/actions-runner-linux-x64-2.316.1.tar.gz

# 3. Giải nén package
tar xzf ./actions-runner-linux-x64-2.316.1.tar.gz
```

### Bước 2.3: Cấu hình kết nối Runner với Repo của bạn
Chạy lệnh cấu hình đi kèm với mã Token bảo mật lấy từ trang GitHub Runners của bạn:
```bash
./config.sh --url https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME> --token <YOUR_REGISTRATION_TOKEN>
```
*Hệ thống sẽ hỏi bạn một số thông tin:*
- **Enter the name of the runner group**: Nhấn `Enter` để chọn mặc định.
- **Enter the name of runner**: Đặt tên dễ nhớ, ví dụ: `ubuntu-vpn-server`.
- **Enter any additional labels**: Nhập `self-hosted` (để trùng khớp với dòng `runs-on: self-hosted` trong file GitHub workflow).
- **Enter name of work folder**: Nhấn `Enter` để chọn mặc định (`_work`).

### Bước 2.4: Cài đặt Runner thành Service chạy ngầm
Để Runner tự chạy kể cả khi bạn tắt cửa sổ terminal SSH:
```bash
# 1. Quay lại quyền root/sudo bằng cách gõ:
exit

# 2. Truy cập vào thư mục của runner
cd /home/github-runner/actions-runner

# 3. Cài đặt runner thành systemd service
sudo ./svc.sh install github-runner

# 4. Kích hoạt và chạy service
sudo ./svc.sh start

# 5. Kiểm tra trạng thái hoạt động của service
sudo ./svc.sh status
```
Bây giờ, nếu bạn quay lại trang **GitHub -> Settings -> Actions -> Runners**, bạn sẽ thấy Runner có trạng thái màu xanh **Idle/Online**.

---

## PHẦN 3: Liên kết GitHub Actions và Coolify Webhook

Chúng ta đã tạo sẵn file pipeline `.github/workflows/deploy.yml` ở máy tính local. Bây giờ chúng ta cần lấy webhook từ Coolify và lưu vào cấu hình bảo mật của GitHub.

### Bước 3.1: Tạo ứng dụng Next.js trên Coolify
1. Trên Coolify Dashboard (`http://<IP_SERVER_UBUNTU_VPN>:8000`), chọn project `portfolio`.
2. Nhấn **Add New Resource** -> **Public Repository** hoặc **Private Repository** (Liên kết với tài khoản GitHub của bạn).
3. Chọn repo `portfolio` của bạn và nhánh `main`.
4. Coolify sẽ tự động nhận diện đây là ứng dụng chạy **Nixpacks** (Node.js/Next.js).
5. Cuộn xuống phần **Webhooks** trong cấu hình ứng dụng trên Coolify, copy đường link **Deploy Webhook URL**. Nó sẽ có dạng như sau:
   `http://<IP_SERVER_UBUNTU_VPN>:8000/api/v1/deploy?uuid=xxxx-xxxx-xxxx`

### Bước 3.2: Cấu hình Secret trên GitHub
1. Vào kho lưu trữ GitHub của bạn trên trình duyệt.
2. Chọn **Settings -> Secrets and variables -> Actions**.
3. Nhấp vào nút **New repository secret**.
4. Đặt tên Secret là: `COOLIFY_DEPLOY_WEBHOOK`
5. Dán đường link Webhook URL vừa copy từ Coolify vào ô giá trị (Value).
6. Nhấp **Add secret**.

---

## PHẦN 4: Cấu hình tên miền nội bộ ảo (Local Routing)

Sau khi deploy thành công, bạn muốn truy cập ứng dụng của mình qua một tên miền đẹp thay vì phải gõ địa chỉ IP và số Port.

### Bước 4.1: Điền tên miền ảo vào Coolify
Trong tab cấu hình ứng dụng trên Coolify, tìm ô **Domains** và điền tên miền mong muốn của bạn, ví dụ:
```text
http://portfolio.local
```
*(Traefik sẽ tự cấu hình định tuyến cho tên miền này).*

### Bước 4.2: Trỏ tên miền về IP Server trên máy tính của bạn
Vì tên miền `portfolio.local` không có thực trên internet, bạn phải báo cho máy tính của bạn biết rằng khi gõ địa chỉ này thì hãy truy cập vào IP của server Ubuntu.

#### Trên máy tính Windows của bạn:
1. Mở ứng dụng **Notepad** dưới quyền quản trị viên (**Run as Administrator**).
2. Mở file theo đường dẫn: `C:\Windows\System32\drivers\etc\hosts`
3. Thêm dòng sau vào cuối file:
   ```text
   <IP_SERVER_UBUNTU_VPN> portfolio.local
   ```
4. Lưu file lại.

#### Trên máy tính macOS hoặc Linux của bạn:
1. Mở terminal và chạy lệnh:
   ```bash
   sudo nano /etc/hosts
   ```
2. Thêm dòng sau xuống cuối file:
   ```text
   <IP_SERVER_UBUNTU_VPN> portfolio.local
   ```
3. Lưu lại (`Ctrl + O`, `Enter` và thoát `Ctrl + X`).

---

## PHẦN 5: Quy trình hoạt động hàng ngày

Từ bây giờ, mỗi lần bạn code xong ở máy tính cá nhân:
1. Bạn chạy lệnh:
   ```bash
   git add .
   git commit -m "feat: cập nhật giao diện portfolio"
   git push origin main
   ```
2. **GitHub Actions** sẽ nhận diện commit mới và đẩy công việc xuống **Self-hosted Runner** đang chạy trên server Ubuntu của bạn.
3. Runner tải code về, chạy lệnh test và build production.
4. Nếu build thành công, Runner gửi tín hiệu Webhook trực tiếp sang **Coolify**.
5. **Coolify** nhận lệnh, kích hoạt container Next.js mới hoạt động và tắt container cũ đi (Zero-downtime deployment).
6. Bạn truy cập `http://portfolio.local` trên trình duyệt máy tính của mình và tận hưởng kết quả!

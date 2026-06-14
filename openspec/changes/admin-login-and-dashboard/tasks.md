## 1. Co so du lieu luot xem va API views

- [ ] 1.1 Khoi tao tep tin `src/data/post-views.json` neu chua ton tai
- [ ] 1.2 Viet API Route `/api/posts/views` de lay va tang luot xem bài viet
- [ ] 1.3 Cap nhat trang xem chi tiet bai viet de goi API POST tang luot xem moi khi nguoi dung doc

## 2. He thong xac thuc Admin

- [ ] 2.1 Viet module helper xac thuc `src/lib/auth.ts` ho tro bam mat khau va ky/xac nhan session token
- [ ] 2.2 Viet API Route `/api/admin/login` kiem tra tai khoan mac dinh va set cookie HTTP-Only `admin_session`
- [ ] 2.3 Viet API Route `/api/admin/logout` de xoa cookie phien dang nhap
- [ ] 2.4 Viet API Route `/api/admin/session` de kiem tra trang thai dang nhap phia client

## 3. Giao dien Login va Admin Dashboard

- [ ] 3.1 Thiet ke trang dang nhap `/admin/login` chin chu, sang trong va tinh te
- [ ] 3.2 Thiet ke trang Dashboard `/admin/dashboard` hien dai, glassmorphism hien thi thong ke, danh sach bai viet
- [ ] 3.3 Thiet lap kiem tra phien dang nhap tren trang `/admin/dashboard` de bao ve va tu dong chuyen huong neu chua dang nhap

## 4. Form va API tao bai viet moi

- [ ] 4.1 Viet API Route `/api/posts/create` (duoc bao ve boi admin session) tu dong tao slug va ghi file Markdown vao thu muc `src/data/posts`
- [ ] 4.2 Thiet ke form soan thao bai viet moi tren Dashboard, gui du lieu len API va tu dong load lai trang sau khi them thanh cong

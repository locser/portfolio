# Phân Tích Lỗi Build Next.js & Hướng Dẫn Giả Lập Rollback Trong CI/CD

Tài liệu này ghi lại chi tiết nguyên nhân gây ra lỗi build ở stage `build-job` trên GitLab CI và cách cấu hình chính xác để kiểm thử tính năng tự động Rollback ở stage `deploy`.

---

## 1. Bản chất của vấn đề (The Build-Time Prerendering Issue)

Trong dự án Next.js (App Router), mặc định mọi Route hoặc API Endpoint không sử dụng các hàm động (như `cookies()`, `headers()`, hoặc `searchParams`) sẽ được Next.js tự động tối ưu hóa và **prerender (tạo tĩnh) ngay tại thời điểm build** (`npm run build`).

Khi chúng ta cố tình viết code ném ra lỗi để test cơ chế Rollback như sau:

```typescript
export async function GET() {
  // Cố tình ném lỗi để kiểm tra cơ chế rollback
  throw new Error("Lỗi giả lập để test Rollback!");
}
```

* **Vấn đề xảy ra**: Next.js cố gắng chạy hàm `GET()` này lúc build để sinh dữ liệu tĩnh cho endpoint `/api/version`. 
* **Hệ quả**: Lỗi bị ném ra ngay lập tức tại thời điểm build -> tiến trình biên dịch Docker Image thất bại (`exit code 1`) và dừng lại ở `build-job`. Do đó, pipeline không bao giờ chạy đến stage `deploy` để kích hoạt cơ chế Rollback.

---

## 2. Giải pháp để Giả Lập Lỗi ở Runtime (Deploy Stage)

Để kiểm tra được cơ chế Rollback ở stage `deploy`, chúng ta cần làm cho **Docker Image được build thành công**, nhưng khi container khởi chạy ở môi trường Staging/Production, API `/api/version` mới bắt đầu ném ra lỗi khi bị Docker Healthcheck gọi.

### Bước 1: Vô hiệu hóa Prerender lúc Build bằng `force-dynamic`

Chúng ta cần khai báo cho Next.js biết `/api/version` là một API động và không được chạy thử lúc build. Chúng ta làm điều này bằng cách xuất biến `dynamic = 'force-dynamic'`.

Cấu hình file `src/app/api/version/route.ts` để giả lập lỗi runtime:

```typescript
import { NextResponse } from "next/server";

// Ép Next.js không chạy thử lúc build (bỏ qua prerender)
export const dynamic = "force-dynamic";

export async function GET() {
  // Chỉ ném lỗi khi có request thực tế ở runtime (ví dụ từ Docker Healthcheck)
  throw new Error("Lỗi giả lập tại runtime để test Rollback!");
}
```

### Bước 2: Cơ chế kích hoạt Rollback hoạt động như thế nào?

Khi push code này lên nhánh `beta` hoặc `prod`:

1. **Stage 1 (test-job)**: Pass.
2. **Stage 2 (build-job)**: Lệnh `next build` bỏ qua việc prerender endpoint `/api/version`. Docker Image được build và push lên Registry thành công.
3. **Stage 3 (deploy-staging)**:
   * Runner pull image mới về và chạy `docker compose up -d`.
   * Container mới khởi chạy. Sau đó, tiến trình kiểm tra Healthcheck trong `docker-compose.yml` được kích hoạt:
     ```yaml
     healthcheck:
       test: ["CMD", "node", "-e", "const http = require('http'); const req = http.request('http://localhost:8080/api/version', ...
     ```
   * Đoạn script trên gửi request `GET` đến `/api/version`. Lúc này, Next.js thực thi API ở **runtime** -> ném lỗi -> trả về mã HTTP `500`.
   * Healthcheck nhận mã `500` (khác `200`) -> container chuyển sang trạng thái `unhealthy`.
   * Script deploy trong `.gitlab-ci.yml` sau 10 lần kiểm tra thấy container `unhealthy` sẽ kích hoạt block Rollback:
     ```bash
     if [ $SUCCESS -ne 1 ]; then
       echo "LỖI: Bản deploy mới không vượt qua Health Check!"
       if [ ! -z "$PREVIOUS_TAG" ]; then
         echo "Tiến hành Rollback về phiên bản cũ: $PREVIOUS_TAG..."
         export IMAGE_TAG=$PREVIOUS_TAG
         docker compose up -d
         echo "Khôi phục hoàn tất."
       fi
     fi
     ```
   * Phiên bản container cũ chạy ổn định được khôi phục thành công.

---

## 3. Cách khôi phục lại trạng thái bình thường sau khi test

Khi đã test xong cơ chế Rollback hoạt động đúng như mong đợi, bạn hãy sửa lại file `src/app/api/version/route.ts` để trả về thông tin version bình thường:

```typescript
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      version: process.env.NEXT_PUBLIC_APP_VERSION || "v0.0.0",
      commit: process.env.NEXT_PUBLIC_COMMIT_SHA || "unknown",
      branch: process.env.NEXT_PUBLIC_BRANCH_NAME || "unknown",
      buildDate: process.env.NEXT_PUBLIC_APP_BUILD_DATE || "unknown",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
```

> **Mẹo nhỏ**: Giữ nguyên dòng `export const dynamic = "force-dynamic";` cho các API trả về thông tin trạng thái/phiên bản hệ thống để đảm bảo Next.js luôn lấy thông tin môi trường thực tế (version, commit SHA, build date...) tại thời điểm chạy thực tế thay vì lưu cứng dữ liệu từ lúc build.

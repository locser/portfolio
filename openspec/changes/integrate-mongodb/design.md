## Context

Hệ thống hiện tại lưu trữ toàn bộ dữ liệu động của Diễn đàn và Blog Comments dưới dạng tệp JSON. Khi chuyển sang MongoDB, chúng ta sẽ cấu hình một cơ sở dữ liệu cục bộ chạy trong Docker container và sử dụng driver Node.js chính thức (`mongodb`) để kết nối trực tiếp trong các Next.js Route Handlers.

## Goals / Non-Goals

**Goals:**
- Tạo file `docker-compose.yml` định nghĩa service `mongodb` để lập trình viên có thể khởi động cơ sở dữ liệu cục bộ bằng 1 lệnh duy nhất.
- Viết helper kết nối MongoDB `src/lib/mongodb.ts` có cơ chế cache connection để sử dụng tối ưu trong môi trường Next.js Development (tránh lỗi cạn kiệt connection do Hot Module Replacement - HMR).
- Thiết kế 5 collections trong MongoDB tương ứng với cấu trúc JSON cũ:
  - `post_views`
  - `post_comments`
  - `forum_channels`
  - `forum_topics`
  - `forum_replies`
- Viết script `scripts/migrate-to-mongo.ts` đọc dữ liệu cũ và đưa vào DB.
- Cập nhật toàn bộ các API endpoints để hoạt động mượt mà với MongoDB.

**Non-Goals:**
- Tích hợp Prisma hay Mongoose ở giai đoạn này. Chúng ta sử dụng trực tiếp driver MongoDB chính thức (`mongodb` npm package) để giữ sự nhẹ nhàng, đơn giản và kiểm soát truy vấn thuần tốt hơn.
- Thay đổi cấu trúc dữ liệu cơ bản (vẫn giữ nguyên cấu trúc JSON hiện có để giảm thiểu rủi ro lỗi logic).

## Decisions

### 1. Sử dụng thư viện MongoDB chính thức (`mongodb` driver) thay vì ORM
- **Lý do**: Driver chính thức hoạt động cực kỳ nhẹ, không có overhead phức tạp, hoàn toàn hỗ trợ TypeScript thông qua Generics, dễ cấu hình và không đòi hỏi các file schema phức tạp như Prisma hay Mongoose. 
- **Giải pháp thay thế**: Prisma (đòi hỏi schema cứng) hoặc Mongoose (schema phức tạp hơn). Sử dụng driver MongoDB thuần giúp giữ sự linh hoạt tương tự như tệp JSON cũ.

### 2. Cấu trúc Database Collections
Chúng ta sẽ ánh xạ cấu trúc JSON hiện tại vào MongoDB Collections như sau:

#### A. Collection `post_views`
Mỗi tài liệu tương ứng với lượt xem của 1 bài viết:
```typescript
interface PostViewDocument {
  _id: string; // Sử dụng slug của bài viết làm _id để truy vấn nhanh nhất
  views: number;
}
```

#### B. Collection `post_comments`
Lưu trữ các bình luận bài viết:
```typescript
interface CommentDocument {
  _id: string; // Tương đương comment id
  slug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId: string | null;
  createdAt: string; // Lưu dạng chuỗi ISO
}
```

#### C. Collection `forum_channels`
```typescript
interface ChannelDocument {
  _id: string;
  title: string;
  description: string;
  allowPublicTopics: boolean;
  createdAt: string;
}
```

#### D. Collection `forum_topics`
```typescript
interface TopicDocument {
  _id: string;
  channelId: string;
  title: string;
  authorName: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  views: number;
  replyCount: number;
}
```

#### E. Collection `forum_replies`
```typescript
interface ReplyDocument {
  _id: string;
  topicId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
}
```

### 3. Đồng bộ Connection trong Next.js (Global Client Promise)
- **Lý do**: Trong Next.js dev server, HMR sẽ reload module mỗi khi có thay đổi code. Nếu khởi tạo MongoClient liên tục sẽ dẫn đến lỗi tràn số lượng kết nối tối đa của MongoDB. Chúng ta sử dụng mẫu thiết kế cache client promise trong biến `global` ở môi trường dev để dùng chung kết nối.

### 4. Chiến lược Migration dữ liệu cũ
- Chúng ta sẽ viết script `scripts/migrate-to-mongo.ts` để đọc các tệp JSON và thực hiện chèn dữ liệu với thao tác `updateOne(..., { $setOnInsert: data }, { upsert: true })` hoặc `replaceOne` để giữ nguyên ID cũ và tránh ghi đè trùng lặp nếu chạy script nhiều lần.

## Risks / Trade-offs

- **[Risk] Mất dữ liệu nếu quên chạy Script di chuyển**
  - *Mitigation*: Script migration sẽ được ghi chi tiết trong tài liệu và chúng ta sẽ chạy nó ngay sau khi DB container hoạt động ổn định.
- **[Risk] Thay đổi cách truy vấn dữ liệu từ đồng bộ (synchronous `fs.readFileSync`) sang bất đồng bộ (asynchronous `await db.collection(...)`)**
  - *Mitigation*: Toàn bộ API Routes của Next.js vốn dĩ đã là async functions, nên việc đổi sang dùng `await` cho MongoDB là rất tự nhiên và không phá vỡ cấu trúc API.

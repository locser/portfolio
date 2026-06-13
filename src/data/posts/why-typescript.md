---
title: "Tại Sao TypeScript Là Lựa Chọn Mặc Định Của Tôi"
date: "2026-05-08"
description: "Từ một người hoài nghi TypeScript đến việc không thể sống thiếu nó — hành trình và những lý do thuyết phục để chuyển đổi."
tags: ["typescript", "web-dev", "learning"]
coverImage: "/images/blog/typescript-default.jpg"
---

Tôi từng nghĩ TypeScript chỉ là "JavaScript với thêm phiền phức". Phải mất một dự án thất bại vì lỗi runtime mới khiến tôi thay đổi suy nghĩ hoàn toàn.

## Câu Chuyện Thất Bại

Năm ngoái, tôi ship một tính năng "nhỏ" lên production. Mọi thứ chạy hoàn hảo trên local. Nhưng trên production, app crash liên tục. Nguyên nhân? Một property `undefined` mà tôi quên kiểm tra:

```javascript
// JavaScript — không ai cảnh báo bạn
function getUser(id) {
  const user = users.find(u => u.id === id);
  return user.name; // 💥 TypeError nếu user là undefined
}
```

Nếu tôi dùng TypeScript, IDE sẽ gạch đỏ ngay lập tức:

```typescript
// TypeScript — lỗi được bắt tại compile-time
function getUser(id: number): string {
  const user = users.find(u => u.id === id);
  return user.name; // ❌ Object is possibly 'undefined'
}
```

## Lợi Ích Thực Tế Của TypeScript

Sau 2 năm sử dụng, đây là những gì tôi nhận được:

### Autocomplete Thông Minh
IDE hiểu rõ data shape của bạn. Khi gõ `user.`, nó gợi ý chính xác các property có sẵn — không cần mở file khác để "nhớ" cấu trúc dữ liệu.

### Refactor An Toàn
Khi đổi tên một property từ `userName` thành `displayName`, TypeScript sẽ đánh dấu **tất cả** các file bị ảnh hưởng. Với JavaScript thuần, bạn phải dùng Find & Replace và cầu nguyện.

### Documentation Tự Động
Type definitions chính là documentation sống:

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  coverImage?: string; // Optional - dấu ? nói lên tất cả
  content: string;
  readingTime: string;
}
```

## Khi Nào TypeScript "Quá Tay"?

TypeScript không phải lúc nào cũng cần thiết:
- **Script nhỏ, dùng 1 lần**: Viết JavaScript thuần nhanh hơn
- **Prototype nhanh**: Đôi khi cần "move fast and break things"
- **Generic types phức tạp**: Đừng biến type system thành trò chơi ô chữ

> "TypeScript là một công cụ, không phải tôn giáo. Hãy dùng nó khi nó giúp ích, bỏ qua khi nó cản trở."

## Kết Luận

TypeScript không hoàn hảo, nhưng nó giải quyết được 90% các lỗi mà tôi hay gặp khi dùng JavaScript thuần. Với tôi, nó đã trở thành **lựa chọn mặc định** — và tôi chưa bao giờ hối hận.

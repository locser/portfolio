---
title: "Hành Trình Bước Vào Thế Giới Web Development"
date: "2026-05-10"
description: "Từ những dòng HTML đầu tiên đến việc xây dựng ứng dụng hoàn chỉnh — câu chuyện cá nhân về con đường trở thành lập trình viên web."
tags: ["career", "learning", "web-dev"]
coverImage: "/images/blog/journey-web-dev.jpg"
---

Tôi còn nhớ rõ cảm giác lần đầu tiên mở Notepad, gõ `<html>` và nhấn Save. Khi file `.html` đó hiển thị dòng chữ "Hello World" trên trình duyệt, tôi biết mình đã tìm thấy thứ mình muốn theo đuổi.

## Khởi Đầu Với HTML & CSS

Mọi thứ bắt đầu từ sự tò mò. Tôi tự hỏi: "Làm thế nào để tạo ra một trang web?" — và câu hỏi đơn giản đó đã dẫn tôi vào một hành trình dài đầy thú vị.

Những ngày đầu, tôi dành hàng giờ để:
- Đọc tài liệu trên **MDN Web Docs**
- Copy-paste code từ các tutorial trên YouTube
- Tự tay xây dựng những trang web tĩnh đầu tiên với chỉ HTML và CSS thuần

> "Hành trình vạn dặm bắt đầu từ một bước chân." — Lão Tử

## Bước Nhảy Sang JavaScript

Khi đã quen với HTML/CSS, JavaScript xuất hiện như một thế giới hoàn toàn mới. Lần đầu tiên tôi viết một hàm `addEventListener` và thấy nút bấm thực sự phản hồi — đó là khoảnh khắc "eureka" thực sự.

Những khái niệm ban đầu khiến tôi vật lộn:
1. **Closures** — Tại sao hàm bên trong lại "nhớ" biến bên ngoài?
2. **Asynchronous** — Promise, callback hell, async/await
3. **DOM manipulation** — Sự khác biệt giữa `querySelector` và `getElementById`

## Khám Phá Thế Giới Framework

Sau khi nắm vững JavaScript cơ bản, tôi bắt đầu tìm hiểu React. Từ Class Components đến Hooks, từ `useState` đến `useEffect` — mỗi concept mới đều mở ra một cánh cửa khác.

```jsx
// Dòng code React đầu tiên của tôi
function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Và rồi Next.js xuất hiện, mang đến SSR, SSG, và một hệ sinh thái hoàn chỉnh cho production-ready apps.

## Bài Học Lớn Nhất

Nhìn lại hành trình, có ba bài học mà tôi muốn chia sẻ:

- **Kiên nhẫn**: Không ai giỏi ngay từ ngày đầu. Mỗi lỗi bug là một bài học.
- **Thực hành**: Đọc 100 bài tutorial không bằng tự tay viết 1 project nhỏ.
- **Cộng đồng**: Tham gia các community (Stack Overflow, Discord, GitHub) giúp bạn học nhanh gấp 10 lần.

Hành trình vẫn đang tiếp tục, và tôi tin rằng điều tuyệt vời nhất của nghề lập trình chính là: **luôn có thứ mới để học**.

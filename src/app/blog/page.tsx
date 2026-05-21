import { Metadata } from "next";
import React from "react";

import { getAllPosts } from "@/src/lib/markdown";

import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog - Góc Chia Sẻ Cá Nhân",
  description: "Trang nhật ký và các bài viết kỹ thuật, thiết kế tối giản, công nghệ lập trình của tôi. Miễn phí truy cập hoàn toàn không cần đăng ký.",
  openGraph: {
    title: "Blog - Góc Chia Sẻ Cá Nhân",
    description: "Trang nhật ký và các bài viết kỹ thuật, thiết kế tối giản, công nghệ lập trình của tôi. Miễn phí truy cập hoàn toàn không cần đăng ký.",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogClient posts={posts} />;
}
export const revalidate = 3600; // Revalidate every hour

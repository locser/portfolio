import { Metadata } from "next";
import React from "react";

import BlogList from "@/src/components/blog/BlogList";
import { getAllPosts } from "@/src/lib/markdown";

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

  return <BlogList initialPosts={posts} />;
}

export const revalidate = 3600; // Revalidate every hour

import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import BlogPostDetail from "@/src/components/blog/BlogPostDetail";
import {
  getPostBySlug,
  getPostSlugs,
  getAllPosts,
  getRelatedPosts,
  getNextPrevPosts,
} from "@/src/lib/markdown";

interface PostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for SSG
export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Bài viết không tồn tại",
    };
  }

  return {
    title: `${post.title} - Blog Cá Nhân`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = getRelatedPosts(post, allPosts, 2);
  const { next, prev } = getNextPrevPosts(post.slug, allPosts);

  return (
    <BlogPostDetail 
      post={post} 
      relatedPosts={relatedPosts} 
      next={next} 
      prev={prev} 
    />
  );
}

export const revalidate = 3600;

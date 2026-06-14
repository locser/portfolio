import Link from "next/link";
import React from "react";

import { getAllPosts, BlogPost } from "@/src/lib/markdown";
import { cn } from "@/src/lib/utils";

const getRandomSpan = (index: number) => {
  const spans = [3, 3, 2, 4, 3, 3];
  return spans[index % spans.length];
};

const BlogPostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const span = getRandomSpan(index);

  return (
    <div
      className={cn(
        "relative rounded-3xl group hover:shadow-lg transition duration-300 p-6 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-[#0f0f10] flex flex-col justify-between overflow-hidden min-h-[280px] shadow-sm dark:shadow-none",
        span === 2 ? "md:col-span-2" : span === 3 ? "md:col-span-3" : "md:col-span-4"
      )}
    >
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
      <div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400 dark:text-zinc-500 mb-3">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readingTime}</span>
        </div>
        <h3 className="font-sans font-bold text-zinc-900 dark:text-white text-xl group-hover:text-zinc-650 dark:group-hover:text-zinc-300 transition-colors duration-200">
          {post.title}
        </h3>
        <p className="font-sans font-normal text-zinc-600 dark:text-zinc-400 text-sm mt-3 leading-relaxed group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors duration-200">
          {post.description.length > 130 ? `${post.description.slice(0, 130)}...` : post.description}
        </p>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5 z-20">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded text-[9px] uppercase font-mono tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200 flex items-center">
          Read more <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </div>
  );
};

const Blog = () => {
  const posts = getAllPosts().slice(0, 3); // Get the 3 latest posts

  return (
    <section id="blog" className="py-24 border-t border-zinc-200 dark:border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5xl mb-4">
              Latest Articles
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl font-light">
              Thoughts on technology, minimalist web design, and programming practices.
            </p>
          </div>
          <Link
            href="/blog"
            className="mt-4 md:mt-0 text-sm font-semibold text-zinc-900 dark:text-white hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors flex items-center group/link"
          >
            View all posts 
            <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {posts.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#050505]">
            <p className="text-zinc-400 dark:text-zinc-500">No articles available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
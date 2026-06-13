"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";

import ThemeToggle from "@/src/components/ThemeToggle";
import { BlogPost } from "@/src/lib/markdown";

interface BlogClientProps {
  posts: BlogPost[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Lấy danh sách tất cả các tag từ các bài viết (không trùng lặp)
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [posts]);

  // Lọc bài viết theo từ khóa tìm kiếm và tag được chọn
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black-100 text-zinc-800 dark:text-zinc-300 font-sans selection:bg-zinc-250 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white transition-colors duration-300">
      {/* Header & Nav */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
          >
            ← Portfolio
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              About
            </Link>
            <span className="text-zinc-950 dark:text-white border-b border-zinc-950 dark:border-white pb-0.5 font-medium">Blog</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4 md:text-5xl">
            Góc Chia Sẻ
          </h1>
          <p className="text-zinc-650 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Nơi ghi chép những trải nghiệm cuộc sống, bài học sự nghiệp và kiến thức công nghệ của tôi. Hoàn toàn tinh giản và tập trung vào nội dung.
          </p>
        </div>

        {/* Search & Tag Filter Box */}
        <div className="space-y-6 mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-250 dark:border-zinc-800 rounded-xl px-5 py-3.5 text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors text-sm shadow-sm dark:shadow-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Tags List */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-2 font-mono font-bold">Tags:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  selectedTag === null
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md dark:shadow-none"
                    : "bg-white dark:bg-[#0a0a0a] text-zinc-650 dark:text-zinc-400 border-zinc-250 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-950 dark:hover:text-white shadow-sm dark:shadow-none"
                }`}
              >
                Tất cả ({posts.length})
              </button>
              {allTags.map((tag) => {
                const count = posts.filter((p) => p.tags.includes(tag)).length;
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                      isSelected
                        ? "bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white shadow-md dark:shadow-none"
                        : "bg-white dark:bg-[#0a0a0a] text-zinc-650 dark:text-zinc-400 border-zinc-250 dark:border-zinc-850 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-950 dark:hover:text-white shadow-sm dark:shadow-none"
                    }`}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="group relative bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 hover:border-zinc-400 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-[#0f0f10] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-none"
                style={{ willChange: "transform, border-color" }}
              >
                <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />
                <div>
                  <div className="flex items-center space-x-3 text-xs text-zinc-400 dark:text-zinc-500 mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-650 dark:group-hover:text-zinc-300 transition-colors mb-3">
                    {post.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">
                    {post.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded text-[10px] uppercase font-mono tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#050505]">
            <p className="text-zinc-400 dark:text-zinc-500">Không tìm thấy bài viết nào phù hợp.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
              className="mt-4 text-xs font-semibold text-zinc-900 dark:text-white underline hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors"
            >
              Reset bộ lọc
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-8 bg-zinc-100 dark:bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-zinc-550 dark:text-zinc-600">
          © {new Date().getFullYear()} Portfolio. Built with Next.js 14 (Monochromatic Minimalist).
        </div>
      </footer>
    </div>
  );
}

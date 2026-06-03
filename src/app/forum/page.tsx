import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import ThemeToggle from "@/src/components/ThemeToggle";
import { getChannels, getTopics } from "@/src/lib/forum";

export const revalidate = 0; // Dynamic server rendering

export const metadata: Metadata = {
  title: "Diễn Đàn Cộng Đồng - Thảo Luận & Hỏi Đáp",
  description: "Không gian thảo luận, chia sẻ kiến thức công nghệ và giải đáp thắc mắc cùng cộng đồng.",
};

export default async function ForumPage() {
  const channels = await getChannels();
  const topicsMap = await getTopics();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black-100 text-zinc-800 dark:text-zinc-300 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white hover:text-zinc-550 dark:hover:text-zinc-400 transition-colors"
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
            <Link href="/projects" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Blog
            </Link>
            <span className="text-zinc-950 dark:text-white border-b border-zinc-950 dark:border-white pb-0.5 font-medium">Forum</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Banner */}
        <section className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4 md:text-5xl">
            Diễn Đàn Thảo Luận
          </h1>
          <p className="text-zinc-500 dark:text-zinc-450 text-lg leading-relaxed max-w-2xl font-light">
            Không gian chia sẻ kiến thức, trao đổi công nghệ và giải đáp thắc mắc cùng cộng đồng phát triển.
          </p>
        </section>

        {/* Channels List */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold mb-6">
            Các chuyên mục thảo luận ({channels.length})
          </h2>

          {channels.length === 0 ? (
            <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-12 text-center text-zinc-400 dark:text-zinc-500 font-light">
              Hiện tại chưa có chuyên mục thảo luận nào. Vui lòng quay lại sau!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {channels.map((channel) => {
                const totalTopics = (topicsMap[channel.id] || []).length;
                return (
                  <div
                    key={channel.id}
                    className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 hover:border-zinc-450 dark:hover:border-zinc-800 hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  >
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-zinc-650 dark:group-hover:text-zinc-200 transition-colors">
                          {channel.title}
                        </h3>
                        {channel.allowPublicTopics ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/40">
                            Tự do thảo luận
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-250 dark:border-amber-900/40">
                            Chỉ Admin đăng bài
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-450 text-sm leading-relaxed font-light">
                        {channel.description}
                      </p>
                      <div className="text-xs font-mono text-zinc-400 flex items-center space-x-2">
                        <span>Chủ đề: {totalTopics}</span>
                        <span>&bull;</span>
                        <span>Tạo ngày: {new Date(channel.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Link
                        href={`/forum/${channel.id}`}
                        className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-350 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-300 transition-all flex items-center space-x-2 whitespace-nowrap self-start md:self-auto"
                      >
                        <span>Truy cập</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-8 bg-zinc-100 dark:bg-[#050505] mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} Portfolio. Built with Next.js 14 (Monochromatic Minimalist).
        </div>
      </footer>
    </div>
  );
}

import fs from "fs";
import path from "path";

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import CreatePostForm from "@/src/components/CreatePostForm";
import DeletePostButton from "@/src/components/DeletePostButton";
import ForumAdminManager from "@/src/components/ForumAdminManager";
import LogoutButton from "@/src/components/LogoutButton";
import ThemeToggle from "@/src/components/ThemeToggle";
import { verifySessionToken } from "@/src/lib/auth";
import { getChannels } from "@/src/lib/forum";
import { getAllPosts } from "@/src/lib/markdown";

export const revalidate = 0; // Dynamic server rendering

export default function AdminDashboardPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  // 1. Authentication Check at Server-Level
  if (!sessionToken) {
    redirect("/admin/login");
  }

  const session = verifySessionToken(sessionToken);
  if (!session) {
    redirect("/admin/login");
  }

  // 2. Fetch Blog Data
  const posts = getAllPosts();

  // 3. Fetch Views Count Data
  const viewsFilePath = path.join(process.cwd(), "src/data/post-views.json");
  let views: Record<string, number> = {};
  try {
    if (fs.existsSync(viewsFilePath)) {
      views = JSON.parse(fs.readFileSync(viewsFilePath, "utf8") || "{}");
    }
  } catch (error) {
    console.error("Failed to read views file on dashboard:", error);
  }

  // 4. Calculate Stats
  const totalPosts = posts.length;
  const totalViews = posts.reduce((sum, post) => sum + (views[post.slug] || 0), 0);

  // 5. Fetch Forum Channels
  const channels = getChannels();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white flex items-center space-x-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
              <span>Portfolio Admin</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-xs bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-lg text-zinc-400 font-mono">
              @{session.username}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/blog"
              className="text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-wider"
              target="_blank"
            >
              Xem Blog của bạn ↗
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title and Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl mb-2">
            Bảng Điều Khiển
          </h1>
          <p className="text-zinc-500 text-sm">
            Chào mừng quay trở lại. Hãy quản lý các bài đăng và theo dõi hiệu suất bài viết của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Stat 1: Total Posts */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-zinc-850/20 rounded-full blur-xl group-hover:bg-zinc-800/30 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold font-mono tracking-widest text-zinc-500 uppercase">
                Tổng Bài Viết
              </span>
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div className="text-4xl font-extrabold text-white font-mono">{totalPosts}</div>
            <p className="text-zinc-500 text-xs mt-2">Bài viết Markdown trong thư mục data</p>
          </div>

          {/* Stat 2: Total Views */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-zinc-850/20 rounded-full blur-xl group-hover:bg-zinc-800/30 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold font-mono tracking-widest text-zinc-500 uppercase">
                Tổng Lượt Đọc
              </span>
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="text-4xl font-extrabold text-white font-mono">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-zinc-500 text-xs mt-2">Tổng số lượt truy cập vào các bài blog</p>
          </div>

          {/* Stat 3: Average Views/Post */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-zinc-850/20 rounded-full blur-xl group-hover:bg-zinc-800/30 transition-all"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold font-mono tracking-widest text-zinc-500 uppercase">
                Trung Bình
              </span>
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <div className="text-4xl font-extrabold text-white font-mono">
              {totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0}
            </div>
            <p className="text-zinc-500 text-xs mt-2">Lượt đọc trung bình trên mỗi bài viết</p>
          </div>
        </div>

        {/* Soạn thảo bài viết mới component */}
        <CreatePostForm />

        {/* Quản lý danh mục diễn đàn */}
        <ForumAdminManager initialChannels={channels} />

        {/* Posts List Section */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
            <h2 className="text-md font-bold tracking-tight text-white font-mono uppercase">
              Danh sách bài viết
            </h2>
            <span className="text-xs text-zinc-550 font-light">
              Hiển thị {posts.length} bài viết
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-light">
              Chưa có bài viết nào được tạo. Hãy nhấn &quot;Soạn Bài Viết Mới&quot; để bắt đầu!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-xs font-mono uppercase text-zinc-500 bg-zinc-950/40">
                    <th className="px-6 py-4 font-semibold tracking-wider">Tên Bài Viết</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Ngày Đăng</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Thẻ Tags</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Lượt Đọc</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Liên Kết</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {posts.map((post) => {
                    const postViews = views[post.slug] || 0;
                    return (
                      <tr
                        key={post.slug}
                        className="hover:bg-zinc-900/20 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-zinc-500 text-xs line-clamp-1 mt-1 font-light italic">
                            {post.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                          {post.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-[10px] rounded-md font-mono text-zinc-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-white">
                          {postViews.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors space-x-1"
                            target="_blank"
                          >
                            <span>Xem bài</span>
                            <span>↗</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <DeletePostButton slug={post.slug} title={post.title} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

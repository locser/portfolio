"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function CreatePostForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("/images/blog/default.jpg");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          coverImage,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi tạo bài viết");
      }

      setSuccess(true);
      setTitle("");
      setDescription("");
      setCoverImage("/images/blog/default.jpg");
      setTags("");
      setContent("");
      setIsOpen(false);
      
      // Refresh server components to load new posts
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định khi lưu bài viết");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8">
      {/* Toggle button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-5 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all text-sm shadow-md"
        >
          <svg
            className="w-4 h-4 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Soạn Bài Viết Mới</span>
        </button>
      ) : (
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 p-6 rounded-3xl shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Soạn thảo bài viết mới (Markdown)</span>
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setError("");
              }}
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs uppercase font-mono tracking-wider"
            >
              Hủy soạn thảo ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-950/30 border border-red-900/50 rounded-2xl text-red-400 text-xs text-center flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-2xl text-emerald-400 text-xs text-center flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bài viết đã được tạo thành công!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-850 rounded-2xl focus:outline-none focus:border-zinc-700 text-sm text-white placeholder-zinc-655 transition-colors"
                  placeholder="Ví dụ: Hành trình lập trình Web"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-850 rounded-2xl focus:outline-none focus:border-zinc-700 text-sm text-white placeholder-zinc-655 transition-colors"
                  placeholder="react, nextjs, learning"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Ảnh bìa (URL)
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-850 rounded-2xl focus:outline-none focus:border-zinc-700 text-sm text-white placeholder-zinc-655 transition-colors"
                  placeholder="/images/blog/cover.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-850 rounded-2xl focus:outline-none focus:border-zinc-700 text-sm text-white placeholder-zinc-655 transition-colors"
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Nội dung bài viết (Markdown)
              </label>
              <textarea
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950/80 border border-zinc-850 rounded-2xl focus:outline-none focus:border-zinc-700 text-sm text-white placeholder-zinc-655 font-mono transition-colors resize-y scrollbar-thin"
                placeholder="## Tiêu đề phụ&#10;&#10;Nội dung bài viết bắt đầu tại đây, bạn có thể sử dụng cú pháp **Markdown** thông thường..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all text-sm flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Đang tạo bài viết...</span>
                  </>
                ) : (
                  <span>Tạo Bài Viết</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface DeletePostButtonProps {
  slug: string;
  title: string;
}

export default function DeletePostButton({ slug, title }: DeletePostButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi xóa bài viết");
      }

      setSuccess(true);
      
      // Keep modal open for a brief second to show success state, then refresh and close
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        router.refresh();
      }, 1000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Lỗi hệ thống khi gửi yêu cầu";
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-350 active:scale-95"
        title="Xóa bài viết"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>

      {/* Confirmation Glassmorphism Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !isDeleting && setIsOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-zinc-900/90 border border-zinc-850 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Visual Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-xl"></div>
            
            {/* Success State */}
            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Đã xóa bài viết!</h3>
                <p className="text-zinc-500 text-xs font-light">Đang cập nhật lại danh sách bài đăng...</p>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
                    <svg
                      className="w-6 h-6"
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
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Xác nhận xóa bài viết
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1 font-light leading-relaxed">
                      Hành động này là vĩnh viễn và không thể khôi phục. Các tệp Markdown liên quan và số lượt đọc sẽ bị làm sạch.
                    </p>
                  </div>
                </div>

                {/* Post Info Box */}
                <div className="bg-zinc-950/60 border border-zinc-850 rounded-2xl p-4 mb-5">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-550 font-mono font-bold block mb-1">
                    Bài viết được chọn:
                  </span>
                  <span className="text-sm font-bold text-white line-clamp-2">
                    {title}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono block mt-1">
                    slug: {slug}
                  </span>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-light">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 justify-end">
                  <button
                    disabled={isDeleting}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-950/40 hover:bg-zinc-850 border border-zinc-850 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="px-4 py-2 text-xs font-bold text-white bg-red-650 hover:bg-red-500 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center space-x-2 shadow-lg shadow-red-950/40 border border-red-500/20"
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                        <span>Đang xóa...</span>
                      </>
                    ) : (
                      <span>Đồng ý xóa</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

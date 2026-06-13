"use client";

import React, { useCallback, useEffect, useState } from "react";

import { ThreadedBlogComment } from "@/src/lib/blog";

interface CommentsSectionProps {
  slug: string;
}

export default function CommentsSection({ slug }: CommentsSectionProps) {
  const [comments, setComments] = useState<ThreadedBlogComment[]>([]);
  const [newlyAddedIds, setNewlyAddedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for root comment
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for replies
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true);
      const res = await fetch(`/api/posts/comments?slug=${slug}`);
      if (!res.ok) {
        throw new Error("Không thể tải danh sách bình luận");
      }
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments(true);
  }, [slug, fetchComments]);

  // Submit root comment
  const handleSubmitRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          authorName: name,
          authorEmail: email || undefined,
          content,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gửi bình luận không thành công");
      }

      const newComment = await res.json();
      setNewlyAddedIds((prev) => [...prev, newComment.id]);

      // Reset form
      setName("");
      setEmail("");
      setContent("");
      
      // Refresh list
      await fetchComments();
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi gửi bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyName.trim() || !replyContent.trim()) return;

    try {
      setIsSubmittingReply(true);
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          authorName: replyName,
          authorEmail: replyEmail || undefined,
          content: replyContent,
          parentId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gửi phản hồi không thành công");
      }

      // Reset form
      setReplyName("");
      setReplyEmail("");
      setReplyContent("");
      setActiveReplyId(null);

      // Refresh list
      await fetchComments();
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi gửi phản hồi");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Helper to format date beautifully
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to calculate total comment count
  const getTotalCommentsCount = () => {
    return comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0);
  };

  // Sort comments so that newly added ones are shown at the top
  const sortedComments = [...comments].sort((a, b) => {
    const aIsNew = newlyAddedIds.includes(a.id);
    const bIsNew = newlyAddedIds.includes(b.id);
    if (aIsNew && !bIsNew) return -1;
    if (!aIsNew && bIsNew) return 1;
    return 0;
  });

  const getCommentNumber = (commentId: string) => {
    const originalIdx = comments.findIndex((c) => c.id === commentId);
    return originalIdx !== -1 ? originalIdx + 1 : comments.length + 1;
  };

  return (
    <section className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-mono font-bold text-zinc-450 dark:text-zinc-550 uppercase tracking-widest flex items-center gap-2">
          Ý kiến độc giả ({getTotalCommentsCount()})
        </h3>
      </div>

      {/* Main Comment Form */}
      <form 
        onSubmit={handleSubmitRoot} 
        className="mb-10 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase mb-4">
          Gửi bình luận của bạn
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
              Tên của bạn *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn A..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
              Email của bạn (tùy chọn)
            </label>
            <input
              type="email"
              placeholder="VD: name@example.com..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
            Nội dung ý kiến *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Viết ý kiến phản hồi của bạn về bài viết này..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light resize-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !content.trim()}
            className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-mono font-bold transition-colors shadow-sm disabled:opacity-40"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi Bình Luận"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-400 rounded-full animate-spin"></div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">Đang tải ý kiến...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-xs text-rose-500 dark:text-rose-400 font-mono">
          Đã xảy ra lỗi khi tải bình luận: {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl bg-white dark:bg-[#0a0a0a] shadow-sm">
          <p className="text-sm text-zinc-450 dark:text-zinc-500 font-light">
            Chưa có ý kiến phản hồi nào. Hãy là người đầu tiên để lại ý kiến đóng góp!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 p-6 rounded-2xl shadow-sm space-y-4"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-sm font-bold text-zinc-700 dark:text-zinc-300 shrink-0">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-sans">
                      {comment.authorName}
                    </h4>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900/60 py-0.5 px-2 rounded-full">
                    #{getCommentNumber(comment.id)}
                  </span>
                  <button
                    onClick={() => {
                      setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                      setReplyName("");
                      setReplyEmail("");
                      setReplyContent("");
                    }}
                    className="text-[10px] font-mono font-medium text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors py-1 px-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
                  >
                    {activeReplyId === comment.id ? "Hủy" : "Trả lời"}
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <p
                className="text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed font-light pl-11 pr-2 mb-2 font-sans whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />

              {/* Reply Form */}
              {activeReplyId === comment.id && (
                <form
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                  className="mt-4 ml-11 bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl space-y-4"
                >
                  <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-350 font-mono uppercase">
                    Trả lời {comment.authorName}
                  </h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                        Tên của bạn *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Nguyễn Văn B..."
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        className="w-full bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-zinc-455 transition-colors font-light"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                        Email (tùy chọn)
                      </label>
                      <input
                        type="email"
                        placeholder="VD: name@example.com..."
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        className="w-full bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-zinc-455 transition-colors font-light"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                      Nội dung phản hồi *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Viết câu trả lời của bạn..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-zinc-455 transition-colors font-light resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveReplyId(null)}
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-white rounded-xl text-[10px] font-mono font-bold uppercase transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyName.trim() || !replyContent.trim()}
                      className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-mono font-bold uppercase transition-colors"
                    >
                      {isSubmittingReply ? "Đang gửi..." : "Gửi phản hồi"}
                    </button>
                  </div>
                </form>
              )}

              {/* Nested Replies (Level 2) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-6 pl-5 border-l border-zinc-200 dark:border-zinc-900 space-y-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-zinc-50/50 dark:bg-[#0c0c0c]/40 border border-zinc-200 dark:border-zinc-900/60 p-4 rounded-xl space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-650 dark:text-zinc-450 shrink-0">
                            {reply.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-zinc-900 dark:text-white font-sans">
                              {reply.authorName}
                            </h5>
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-550 font-mono">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                            setReplyName("");
                            setReplyEmail("");
                            setReplyContent(`@${reply.authorName} `);
                          }}
                          className="text-[9px] font-mono uppercase font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                          Trả lời
                        </button>
                      </div>

                      <p
                        className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light pl-9 mb-1 font-sans whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: reply.content }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

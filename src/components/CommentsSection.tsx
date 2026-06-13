"use client";

import React, { useCallback, useEffect, useState } from "react";

interface Comment {
  id: string;
  slug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

interface ThreadedComment extends Comment {
  replies: Comment[];
}

interface CommentsSectionProps {
  slug: string;
}

export default function CommentsSection({ slug }: CommentsSectionProps) {
  const [comments, setComments] = useState<ThreadedComment[]>([]);
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
        throw new Error("Failed to load comments");
      }
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
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
        throw new Error(errorData.error || "Failed to post comment");
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
        throw new Error(errorData.error || "Failed to post reply");
      }

      // Reset form
      setReplyName("");
      setReplyEmail("");
      setReplyContent("");
      setActiveReplyId(null);

      // Refresh list
      await fetchComments();
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi gửi câu trả lời");
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

  // Helper to calculate total comment count (roots + replies)
  const getTotalCommentsCount = () => {
    return comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0);
  };

  // Sort comments so that newly added ones in this session are shown at the very top
  const sortedComments = [...comments].sort((a, b) => {
    const aIsNew = newlyAddedIds.includes(a.id);
    const bIsNew = newlyAddedIds.includes(b.id);
    if (aIsNew && !bIsNew) return -1;
    if (!aIsNew && bIsNew) return 1;
    return 0; // Keep the original database chronological order
  });

  // Helper to get chronological comment number based on database array
  const getCommentNumber = (commentId: string) => {
    const originalIdx = comments.findIndex((c) => c.id === commentId);
    return originalIdx !== -1 ? originalIdx + 1 : comments.length + 1;
  };

  return (
    <section className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-sm font-mono flex items-center gap-2">
          <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Ý kiến độc giả ({getTotalCommentsCount()})
        </h3>
      </div>

      {/* Main Comment Form */}
      <form onSubmit={handleSubmitRoot} className="mb-10 bg-white/50 dark:bg-[#080808]/40 border border-zinc-200 dark:border-zinc-900/60 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-none transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-800">
        <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4 font-sans">Gửi bình luận mới</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              required
              placeholder="Tên của bạn *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent transition-all duration-300 font-sans"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email của bạn (tùy chọn để nhận phản hồi)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-850 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent transition-all duration-300 font-sans"
            />
          </div>
        </div>

        <div className="mb-4">
          <textarea
            required
            rows={4}
            placeholder="Viết ý kiến của bạn vào đây... *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-50/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-850 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent transition-all duration-300 resize-none font-sans leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !content.trim()}
            className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 hover:bg-zinc-850 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi Bình Luận"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-6 h-6 border-2 border-zinc-400 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white rounded-full animate-spin"></div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">Đang tải bình luận...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-sm text-red-500 dark:text-red-400 font-sans">
          Đã xảy ra lỗi khi tải bình luận: {error}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-900 rounded-2xl bg-zinc-50/20 dark:bg-zinc-950/5">
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-light">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại ý kiến!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <div
              key={comment.id}
              className="group/card bg-white dark:bg-[#080808]/30 border border-zinc-150 dark:border-zinc-900/50 p-6 rounded-2xl shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300 animate-fadeIn"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-mono text-sm font-bold text-zinc-700 dark:text-zinc-350 shrink-0">
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
                  <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-650 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-900/60 py-1 px-2.5 rounded-lg shadow-sm">
                    #{getCommentNumber(comment.id)}
                  </span>
                  {/* Reply button */}
                  <button
                    onClick={() => {
                      setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                      setReplyName("");
                      setReplyEmail("");
                      setReplyContent("");
                    }}
                    className="text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors py-1 px-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-lg"
                  >
                    {activeReplyId === comment.id ? "Hủy" : "Trả lời"}
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <p
                className="text-sm text-zinc-750 dark:text-zinc-350 leading-relaxed font-light pl-11 pr-2 mb-4 font-sans whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />

              {/* Reply Form */}
              {activeReplyId === comment.id && (
                <form
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                  className="mt-4 ml-11 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl shadow-inner animate-slideDown"
                >
                  <h5 className="text-xs font-medium text-zinc-850 dark:text-zinc-350 mb-3 font-sans">
                    Trả lời bình luận của {comment.authorName}
                  </h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      required
                      placeholder="Tên của bạn *"
                      value={replyName}
                      onChange={(e) => setReplyName(e.target.value)}
                      className="w-full bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-450 dark:focus:ring-zinc-600 focus:border-transparent transition-all duration-300 font-sans"
                    />
                    <input
                      type="email"
                      placeholder="Email (tùy chọn)"
                      value={replyEmail}
                      onChange={(e) => setReplyEmail(e.target.value)}
                      className="w-full bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-450 dark:focus:ring-zinc-600 focus:border-transparent transition-all duration-300 font-sans"
                    />
                  </div>

                  <div className="mb-3">
                    <textarea
                      required
                      rows={3}
                      placeholder="Viết câu trả lời của bạn... *"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-zinc-450 dark:focus:ring-zinc-600 focus:border-transparent transition-all duration-300 resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveReplyId(null)}
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReply || !replyName.trim() || !replyContent.trim()}
                      className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300 hover:bg-zinc-850 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
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
                      className="bg-zinc-50/40 dark:bg-zinc-950/10 border border-zinc-100 dark:border-zinc-900/40 p-4 rounded-xl shadow-sm hover:border-zinc-200 dark:hover:border-zinc-850 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-650 dark:text-zinc-450 shrink-0">
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
                        
                        {/* Dynamic nested replying: replying to Level 2 reply re-targets Root Comment */}
                        <button
                          onClick={() => {
                            setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                            setReplyName("");
                            setReplyEmail("");
                            setReplyContent(`@${reply.authorName} `);
                          }}
                          className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-450 dark:text-zinc-550 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                          Trả lời
                        </button>
                      </div>

                      <p
                        className="text-xs text-zinc-700 dark:text-zinc-400 leading-relaxed font-light pl-9 mb-1 font-sans whitespace-pre-line"
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

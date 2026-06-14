"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import { Channel, Topic, Reply } from "@/src/lib/forum";

interface TopicDetailsViewProps {
  channel: Channel;
  initialTopic: Topic;
  initialReplies: Reply[];
}

export default function TopicDetailsView({ channel, initialTopic, initialReplies }: TopicDetailsViewProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  
  // Vote tracking
  const [votedMap, setVotedMap] = useState<Record<string, "up" | "down">>({});
  
  // Reply form states
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("forum_voted_topics");
      if (stored) {
        setVotedMap(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu bình chọn:", e);
    }
  }, []);

  const handleVote = async (direction: "up" | "down") => {
    const currentVote = votedMap[topic.id];
    if (currentVote) {
      alert("Bạn đã thực hiện bình chọn cho chủ đề này rồi!");
      return;
    }

    try {
      const res = await fetch("/api/forum/topics/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: channel.id, topicId: topic.id, direction }),
      });

      if (res.ok) {
        const data = await res.json();
        
        const newVotedMap = { ...votedMap, [topic.id]: direction };
        setVotedMap(newVotedMap);
        localStorage.setItem("forum_voted_topics", JSON.stringify(newVotedMap));

        setTopic((prev) => ({
          ...prev,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
        }));
      }
    } catch (err) {
      console.error("Lỗi bình chọn:", err);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content) {
      setMessage({ type: "error", text: "Vui lòng nhập tên người gửi và nội dung phản hồi" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/forum/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: channel.id,
          topicId: topic.id,
          authorName,
          authorEmail: authorEmail || undefined,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Có lỗi xảy ra khi gửi bình luận" });
      } else {
        setMessage({ type: "success", text: "Đăng bình luận thành công!" });
        setAuthorName("");
        setAuthorEmail("");
        setContent("");
        
        // Sync replies
        const repliesRes = await fetch(`/api/forum/replies?topicId=${topic.id}`);
        if (repliesRes.ok) {
          const updatedReplies = await repliesRes.json();
          setReplies(updatedReplies);
        }

        // Increment replyCount locally
        setTopic((prev) => ({
          ...prev,
          replyCount: (prev.replyCount || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      setMessage({ type: "error", text: "Lỗi kết nối mạng hệ thống" });
    } finally {
      setLoading(false);
    }
  };

  const netScore = (topic.upvotes || 0) - (topic.downvotes || 0);
  const userVote = votedMap[topic.id];

  return (
    <div className="space-y-8">
      {/* Dynamic Topic Workspace */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Breadcrumb info */}
        <div className="text-xs font-mono text-zinc-400 flex items-center space-x-2">
          <Link href="/forum" className="hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors">
            Diễn đàn
          </Link>
          <span>/</span>
          <Link href={`/forum/${channel.id}`} className="hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors">
            {channel.title}
          </Link>
        </div>

        {/* Title & Vote Block */}
        <div className="flex items-start space-x-4">
          {/* Vote widget */}
          <div className="flex flex-col items-center space-y-1 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl px-2.5 py-2 border border-zinc-200 dark:border-zinc-900 text-xs font-mono font-bold self-start mt-1">
            <button
              onClick={() => handleVote("up")}
              className={`hover:text-zinc-900 dark:hover:text-white transition-colors p-1 ${
                userVote === "up" ? "text-emerald-500" : "text-zinc-400"
              }`}
              title="Bình chọn tốt"
            >
              ▲
            </button>
            <span className={`text-center leading-none ${
              netScore > 0 ? "text-zinc-900 dark:text-white" : netScore < 0 ? "text-rose-500" : "text-zinc-500"
            }`}>
              {netScore}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`hover:text-zinc-900 dark:hover:text-white transition-colors p-1 ${
                userVote === "down" ? "text-rose-500" : "text-zinc-400"
              }`}
              title="Bình chọn kém"
            >
              ▼
            </button>
          </div>

          {/* Title and stats */}
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug">
              {topic.title}
            </h1>
            
            <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-sans font-medium text-zinc-650 dark:text-zinc-400">Đăng bởi @{topic.authorName}</span>
              <span>&bull;</span>
              <span>Tạo ngày: {new Date(topic.createdAt).toLocaleString("vi-VN")}</span>
              <span>&bull;</span>
              <span>Lượt xem: {topic.views || 0}</span>
              <span>&bull;</span>
              <span className="font-semibold text-zinc-550 dark:text-zinc-400">Phản hồi: {topic.replyCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-6">
          <p className="text-zinc-650 dark:text-zinc-300 text-base leading-relaxed font-light whitespace-pre-wrap">
            {topic.content}
          </p>
        </div>
      </div>

      {/* Replies/Comments Timeline */}
      <div className="space-y-6">
        <h2 className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
          Các phản hồi thảo luận ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 text-center text-zinc-400 dark:text-zinc-500 font-light shadow-sm">
            Chưa có phản hồi nào cho chủ đề này. Hãy là người đầu tiên đưa ra câu trả lời/bình luận!
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply, index) => (
              <div
                key={reply.id}
                className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 md:p-6 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      @{reply.authorName}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      #{index + 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(reply.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-350 text-sm leading-relaxed font-light whitespace-pre-wrap">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Reply Form */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-mono uppercase mb-5">
          Gửi Phản Hồi Của Bạn
        </h3>

        <form onSubmit={handleSubmitReply} className="space-y-4">
          {message && (
            <div className={`p-4 rounded-xl text-sm border font-light ${
              message.type === "success"
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400"
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                Tên của bạn
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="VD: Nguyễn Văn B..."
                className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                Email (tùy chọn)
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="VD: name@example.com..."
                className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
              Nội dung câu trả lời
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung phản hồi, ý kiến đóng góp của bạn về chủ đề này..."
              rows={4}
              className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl text-xs font-mono font-bold transition-colors shadow-sm"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi phản hồi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

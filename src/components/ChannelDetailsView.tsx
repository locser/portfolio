"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";

import { Channel, Topic } from "@/src/lib/forum";

interface ChannelDetailsViewProps {
  channel: Channel;
  initialTopics: Topic[];
  isAdmin: boolean;
}

export default function ChannelDetailsView({ channel, initialTopics, isAdmin }: ChannelDetailsViewProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [sort, setSort] = useState<"newest" | "upvotes">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Vote states (topicId -> 'up' | 'down')
  const [votedMap, setVotedMap] = useState<Record<string, "up" | "down">>({});
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load voted topics from localStorage
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

  const refreshTopics = useCallback(async () => {
    try {
      const res = await fetch(`/api/forum/topics?channelId=${channel.id}&sort=${sort}`);
      if (res.ok) {
        const data = await res.json();
        setTopics(data);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ chủ đề:", err);
    }
  }, [channel.id, sort]);

  // Re-fetch when sort changes
  useEffect(() => {
    refreshTopics();
  }, [refreshTopics]);

  const handleVote = async (topicId: string, direction: "up" | "down") => {
    const currentVote = votedMap[topicId];
    if (currentVote) {
      alert("Bạn đã thực hiện bình chọn cho chủ đề này rồi!");
      return;
    }

    try {
      const res = await fetch("/api/forum/topics/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: channel.id, topicId, direction }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update local voted map
        const newVotedMap = { ...votedMap, [topicId]: direction };
        setVotedMap(newVotedMap);
        localStorage.setItem("forum_voted_topics", JSON.stringify(newVotedMap));

        // Update topic counts locally
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id === topicId) {
              return {
                ...t,
                upvotes: data.upvotes,
                downvotes: data.downvotes,
              };
            }
            return t;
          })
        );
      }
    } catch (err) {
      console.error("Lỗi khi bình chọn:", err);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authorName || !content) {
      setFormMessage({ type: "error", text: "Vui lòng nhập đầy đủ các trường thông tin" });
      return;
    }

    setFormLoading(true);
    setFormMessage(null);

    try {
      const res = await fetch("/api/forum/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: channel.id,
          title,
          authorName,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormMessage({ type: "error", text: data.error || "Có lỗi xảy ra khi tạo chủ đề" });
      } else {
        setFormMessage({ type: "success", text: "Đăng chủ đề thảo luận mới thành công!" });
        setTitle("");
        setAuthorName("");
        setContent("");
        setShowForm(false);
        await refreshTopics();
      }
    } catch (err) {
      console.error("Lỗi đăng chủ đề:", err);
      setFormMessage({ type: "error", text: "Lỗi kết nối mạng hệ thống" });
    } finally {
      setFormLoading(false);
    }
  };

  // Filter topics based on search query
  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2 mb-3">
          <span className="text-xs font-mono text-zinc-400">Chuyên mục thảo luận</span>
          {channel.allowPublicTopics ? (
            <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/40">
              Công khai
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-250 dark:border-amber-900/40">
              Chỉ Admin đăng bài
            </span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
          {channel.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-450 text-sm leading-relaxed font-light">
          {channel.description}
        </p>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm chủ đề..."
            className="w-full bg-white dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl pl-4 pr-10 py-2.5 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light shadow-sm"
          />
        </div>

        {/* Sort & Create */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <div className="flex bg-zinc-100 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-200 dark:border-zinc-900 text-xs font-mono">
            <button
              onClick={() => setSort("newest")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sort === "newest"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200"
              }`}
            >
              Mới nhất
            </button>
            <button
              onClick={() => setSort("upvotes")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                sort === "upvotes"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-zinc-200"
              }`}
            >
              Bình chọn nhiều
            </button>
          </div>

          {(channel.allowPublicTopics || isAdmin) && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl text-xs font-mono font-bold transition-all shadow-sm whitespace-nowrap"
            >
              {showForm ? "Đóng form" : "Đăng chủ đề"}
            </button>
          )}
        </div>
      </div>

      {/* Form to Create Topic */}
      {showForm && (channel.allowPublicTopics || isAdmin) && (
        <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-mono uppercase mb-5">
            Tạo Chủ Đề Thảo Luận Mới
          </h3>

          <form onSubmit={handleCreateTopic} className="space-y-4">
            {formMessage && (
              <div className={`p-4 rounded-xl text-sm border font-light ${
                formMessage.type === "success"
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400"
              }`}>
                {formMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                  Tiêu đề chủ đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Cần trợ giúp cấu hình Tailwind..."
                  className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                  Tên người đăng
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A..."
                  className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-zinc-400 dark:text-zinc-500">
                Nội dung chi tiết
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung câu hỏi hoặc thảo luận chi tiết của bạn tại đây..."
                rows={5}
                className="w-full bg-zinc-50 dark:bg-[#0c0c0c] border border-zinc-200 dark:border-zinc-900 rounded-xl px-4 py-3 text-zinc-800 dark:text-zinc-300 text-sm focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors font-light resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-xl text-xs font-mono font-bold transition-colors shadow-sm"
                disabled={formLoading}
              >
                {formLoading ? "Đang đăng..." : "Đăng thảo luận"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Show admin message if public topic is closed and user is not admin */}
      {!channel.allowPublicTopics && !isAdmin && (
        <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-250 dark:border-amber-900/30 p-4 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-light flex items-center space-x-2">
          <span>⚠️</span>
          <span>Chuyên mục này bị giới hạn. Chỉ quản trị viên diễn đàn mới được phép tạo chủ đề mới. Bạn có thể bình chọn và thảo luận ở các chủ đề sẵn có.</span>
        </div>
      )}

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.length === 0 ? (
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-12 text-center text-zinc-400 dark:text-zinc-500 font-light shadow-sm">
            {searchQuery ? "Không tìm thấy chủ đề nào khớp với từ khóa tìm kiếm." : "Chưa có chủ đề thảo luận nào. Hãy đăng chủ đề đầu tiên!"}
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const netScore = (topic.upvotes || 0) - (topic.downvotes || 0);
            const userVote = votedMap[topic.id];

            return (
              <div
                key={topic.id}
                className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 md:p-6 shadow-sm hover:border-zinc-350 dark:hover:border-zinc-800 hover:shadow-md transition-all duration-300 flex items-start space-x-4"
              >
                {/* Voting Column */}
                <div className="flex flex-col items-center space-y-1 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl px-2 py-2 border border-zinc-200 dark:border-zinc-900 text-xs font-mono font-bold self-start">
                  <button
                    onClick={() => handleVote(topic.id, "up")}
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
                    onClick={() => handleVote(topic.id, "down")}
                    className={`hover:text-zinc-900 dark:hover:text-white transition-colors p-1 ${
                      userVote === "down" ? "text-rose-500" : "text-zinc-400"
                    }`}
                    title="Bình chọn kém"
                  >
                    ▼
                  </button>
                </div>

                {/* Topic Info */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight leading-snug line-clamp-1 hover:text-zinc-550 dark:hover:text-zinc-400 transition-colors">
                    <Link href={`/forum/${channel.id}/${topic.id}`}>
                      {topic.title}
                    </Link>
                  </h3>
                  <p className="text-zinc-450 dark:text-zinc-500 text-xs font-light line-clamp-2">
                    {topic.content}
                  </p>
                  <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                    <span className="font-sans font-medium text-zinc-650 dark:text-zinc-400">@{topic.authorName}</span>
                    <span>&bull;</span>
                    <span>Tạo ngày: {new Date(topic.createdAt).toLocaleDateString("vi-VN")}</span>
                    <span>&bull;</span>
                    <span>Lượt xem: {topic.views || 0}</span>
                    <span>&bull;</span>
                    <span className="font-semibold text-zinc-550 dark:text-zinc-400">Phản hồi: {topic.replyCount || 0}</span>
                  </div>
                </div>

                {/* Read Button */}
                <Link
                  href={`/forum/${channel.id}/${topic.id}`}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-350 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-400 transition-all self-center whitespace-nowrap"
                >
                  Đọc tiếp ➔
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";

import { Channel } from "@/src/lib/forum";

interface ForumAdminManagerProps {
  initialChannels: Channel[];
}

export default function ForumAdminManager({ initialChannels }: ForumAdminManagerProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  
  // Form states
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowPublicTopics, setAllowPublicTopics] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refreshChannels = async () => {
    try {
      const res = await fetch("/api/forum/channels");
      if (res.ok) {
        const data = await res.json();
        setChannels(data);
      }
    } catch (err) {
      console.error("Lỗi khi đồng bộ danh mục:", err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setAllowPublicTopics(true);
    setMessage(null);
  };

  const startEdit = (channel: Channel) => {
    setEditId(channel.id);
    setTitle(channel.title);
    setDescription(channel.description);
    setAllowPublicTopics(channel.allowPublicTopics);
    setMessage(null);
    
    // Scroll to form
    const element = document.getElementById("channel-form-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage({ type: "error", text: "Tiêu đề và mô tả không được để trống" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const url = "/api/forum/channels";
      const method = editId ? "PUT" : "POST";
      const payload = editId 
        ? { id: editId, title, description, allowPublicTopics }
        : { title, description, allowPublicTopics };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Có lỗi xảy ra" });
      } else {
        setMessage({ 
          type: "success", 
          text: editId ? "Cập nhật danh mục thành công!" : "Tạo danh mục thảo luận mới thành công!" 
        });
        resetForm();
        await refreshChannels();
      }
    } catch (err) {
      console.error("Error submitting channel form:", err);
      setMessage({ type: "error", text: "Lỗi kết nối mạng hệ thống" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chuyên mục "${title}"? Tất cả chủ đề và bình luận thuộc chuyên mục này cũng sẽ bị xóa vĩnh viễn.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/forum/channels?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Không thể xóa chuyên mục");
      } else {
        await refreshChannels();
      }
    } catch (err) {
      console.error("Error deleting channel:", err);
      alert("Lỗi kết nối mạng khi thực hiện xóa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 my-12">
      {/* List section */}
      <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
          <h2 className="text-md font-bold tracking-tight text-white font-mono uppercase">
            Quản Lý Chuyên Mục Diễn Đàn
          </h2>
          <span className="text-xs text-zinc-500 font-light">
            Hiển thị {channels.length} chuyên mục
          </span>
        </div>

        {channels.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-light">
            Chưa có chuyên mục diễn đàn nào. Hãy sử dụng form bên dưới để tạo chuyên mục đầu tiên!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-xs font-mono uppercase text-zinc-500 bg-zinc-950/40">
                  <th className="px-6 py-4 font-semibold tracking-wider">Tên chuyên mục</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Quyền Đăng Bài</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {channels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-zinc-900/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
                        {channel.title}
                      </div>
                      <div className="text-zinc-500 text-xs line-clamp-1 mt-1 font-light italic">
                        {channel.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      {channel.allowPublicTopics ? (
                        <span className="text-emerald-500 bg-emerald-950/20 border border-emerald-900/40 px-2 py-0.5 rounded-full">
                          Mọi người
                        </span>
                      ) : (
                        <span className="text-amber-500 bg-amber-950/20 border border-amber-900/40 px-2 py-0.5 rounded-full">
                          Chỉ Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                      {new Date(channel.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center space-x-4">
                        <button
                          onClick={() => startEdit(channel)}
                          className="text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDelete(channel.id, channel.title)}
                          className="text-xs text-rose-500 hover:text-rose-400 transition-colors font-medium"
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form section */}
      <div 
        id="channel-form-section" 
        className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 md:p-8"
      >
        <h3 className="text-lg font-bold text-white font-mono uppercase mb-6">
          {editId ? "Cập Nhật Chuyên Mục" : "Tạo Chuyên Mục Thảo Luận Mới"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-xl text-sm border font-light ${
              message.type === "success" 
                ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" 
                : "bg-rose-950/20 border-rose-900/40 text-rose-400"
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Tên chuyên mục
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Hỏi đáp Next.js, Thảo luận chung..."
                className="w-full bg-black/60 border border-zinc-850 rounded-xl px-4 py-3 text-zinc-300 text-sm focus:outline-none focus:border-zinc-700 transition-colors font-light"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Quyền đăng chủ đề
              </label>
              <div className="flex items-center space-x-4 h-[46px]">
                <label className="flex items-center space-x-2 text-sm text-zinc-450 cursor-pointer">
                  <input
                    type="radio"
                    name="permission"
                    checked={allowPublicTopics === true}
                    onChange={() => setAllowPublicTopics(true)}
                    className="accent-zinc-400"
                  />
                  <span>Tự do (Free/Public)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-zinc-450 cursor-pointer">
                  <input
                    type="radio"
                    name="permission"
                    checked={allowPublicTopics === false}
                    onChange={() => setAllowPublicTopics(false)}
                    className="accent-zinc-400"
                  />
                  <span>Chỉ Admin</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase text-zinc-400">
              Mô tả chuyên mục
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả ngắn gọn về chủ đề sinh hoạt của chuyên mục này..."
              rows={3}
              className="w-full bg-black/60 border border-zinc-850 rounded-xl px-4 py-3 text-zinc-300 text-sm focus:outline-none focus:border-zinc-700 transition-colors font-light resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-zinc-900 border border-zinc-850 rounded-xl text-xs font-mono hover:bg-zinc-800 text-zinc-400 transition-colors"
                disabled={loading}
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <span>{loading ? "Đang xử lý..." : editId ? "Cập Nhật" : "Tạo Chuyên Mục"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

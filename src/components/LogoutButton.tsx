"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 rounded-xl text-xs font-medium font-mono uppercase tracking-wider transition-colors active:scale-95 disabled:opacity-50"
    >
      {loading ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}

"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch bằng cách kiểm tra component đã mounted hay chưa
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-850/50 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all duration-300 shadow-sm dark:shadow-none"
      aria-label="Chuyển đổi Giao diện"
    >
      {isDark ? <FiSun size={15} /> : <FiMoon size={15} />}
    </button>
  );
}

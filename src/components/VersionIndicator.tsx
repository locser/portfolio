"use client";

import React, { useEffect, useState } from "react";

export default function VersionIndicator() {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
  const buildDate = process.env.NEXT_PUBLIC_APP_BUILD_DATE || "2026-06-14 23:30";
  const displayVersion = version.startsWith("v") ? version : `v${version}`;

  return (
    <div className="fixed bottom-3 right-3 z-50 select-none pointer-events-auto">
      <div 
        className="px-2.5 py-1 text-[10px] font-mono tracking-wider text-zinc-500/80 hover:text-zinc-850 dark:text-neutral-500/80 dark:hover:text-neutral-300 bg-zinc-100/70 dark:bg-[#0a0a0a]/50 backdrop-blur-md border border-zinc-200/50 dark:border-neutral-800/60 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
        title={`Version: ${displayVersion} | Built: ${buildDate}`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400/80 mr-1.5 animate-pulse" />
        {displayVersion} • {buildDate}
      </div>
    </div>
  );
}

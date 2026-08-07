"use client";

import React, { useEffect, useState } from "react";

export default function VersionIndicator() {
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const version = process.env.NEXT_PUBLIC_APP_VERSION || "v0.0.0";
  const buildDate = process.env.NEXT_PUBLIC_APP_BUILD_DATE || "unknown";
  const commit = process.env.NEXT_PUBLIC_COMMIT_SHA || "unknown";
  const branch = process.env.NEXT_PUBLIC_BRANCH_NAME || "unknown";
  const displayVersion = version.startsWith("v") ? version : `v${version}`;

  // Kiểm tra xem commit SHA đã nằm trong chuỗi version chưa để tránh hiển thị lặp
  const hasCommitInVersion = version.includes(commit) || (commit !== "unknown" && version.includes(commit.substring(0, 7)));
  const displayLabel = hasCommitInVersion ? displayVersion : `${displayVersion} (${commit.substring(0, 7)})`;

  return (
    <div className="fixed bottom-3 right-3 z-50 select-none pointer-events-auto">
      <div 
        className="px-2.5 py-1 text-[10px] font-mono tracking-wider text-zinc-500/80 hover:text-zinc-850 dark:text-neutral-500/80 dark:hover:text-neutral-300 bg-zinc-100/70 dark:bg-[#0a0a0a]/50 backdrop-blur-md border border-zinc-200/50 dark:border-neutral-800/60 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
        title={`Version: ${displayVersion}\nCommit: ${commit}\nBranch: ${branch}\nBuilt: ${buildDate}`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400/80 mr-1.5 animate-pulse" />
        {displayLabel}
      </div>
    </div>
  );
}

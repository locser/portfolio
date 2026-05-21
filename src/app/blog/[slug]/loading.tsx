import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black-100 text-zinc-750 dark:text-zinc-300 font-sans transition-colors duration-300">
      {/* Skeleton Navbar Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="flex space-x-6 items-center">
            <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-8" />

        {/* Article Header skeleton */}
        <div className="space-y-4 mb-10">
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-zinc-300 dark:bg-zinc-800/80 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Content paragraph skeletons */}
        <div className="space-y-6">
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
          
          {/* Big block/image skeleton */}
          <div className="h-44 w-full bg-zinc-200 dark:bg-zinc-850 rounded-2xl animate-pulse my-10" />
          
          <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-850 rounded animate-pulse" />
        </div>
      </main>
    </div>
  );
}

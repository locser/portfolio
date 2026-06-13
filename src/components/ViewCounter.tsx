"use client";

import React, { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function incrementAndFetchViews() {
      try {
        const response = await fetch("/api/posts/views", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });

        if (!response.ok) {
          throw new Error("Failed to update views");
        }

        const data = await response.json();
        if (isMounted && data.success) {
          setViews(data.views);
        }
      } catch (error) {
        console.error("Error updating views:", error);
        // Fallback: Try to get current views if POST failed
        try {
          const response = await fetch(`/api/posts/views?slug=${slug}`);
          if (response.ok) {
            const data = await response.json();
            if (isMounted) {
              setViews(data.views);
            }
          }
        } catch (err) {
          console.error("Error fetching views fallback:", err);
        }
      }
    }

    incrementAndFetchViews();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (views === null) {
    return (
      <span className="inline-flex items-center space-x-1 animate-pulse">
        <svg
          className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">... lượt xem</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1">
      <svg
        className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        {views.toLocaleString()} lượt xem
      </span>
    </span>
  );
}

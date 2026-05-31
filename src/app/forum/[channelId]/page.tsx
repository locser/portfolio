import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import ChannelDetailsView from "@/src/components/ChannelDetailsView";
import ThemeToggle from "@/src/components/ThemeToggle";
import { verifySessionToken } from "@/src/lib/auth";
import { getChannels, getTopics } from "@/src/lib/forum";

export const revalidate = 0; // Dynamic server rendering

interface PageProps {
  params: {
    channelId: string;
  };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const channels = getChannels();
  const channel = channels.find((c) => c.id === params.channelId);
  
  if (!channel) {
    return {
      title: "Không Tìm Thấy Chuyên Mục",
    };
  }

  return {
    title: `${channel.title} - Diễn Đàn Thảo Luận`,
    description: channel.description,
  };
}

export default function ChannelPage({ params }: PageProps) {
  const { channelId } = params;
  
  // 1. Fetch channel info
  const channels = getChannels();
  const channel = channels.find((c) => c.id === channelId);

  if (!channel) {
    notFound();
  }

  // 2. Fetch topics
  const topicsMap = getTopics();
  const topicsList = topicsMap[channelId] || [];

  // Sort by newest by default on server load
  topicsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 3. Admin session check
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const isAdmin = sessionToken ? !!verifySessionToken(sessionToken) : false;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black-100 text-zinc-800 dark:text-zinc-300 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/forum"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white hover:text-zinc-550 dark:hover:text-zinc-400 transition-colors"
          >
            ← Diễn đàn
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/projects" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/forum" className="text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Forum
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <ChannelDetailsView 
          channel={channel} 
          initialTopics={topicsList} 
          isAdmin={isAdmin} 
        />
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-8 bg-zinc-100 dark:bg-[#050505] mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} Portfolio. Built with Next.js 14 (Monochromatic Minimalist).
        </div>
      </footer>
    </div>
  );
}

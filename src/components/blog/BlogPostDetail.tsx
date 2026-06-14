import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import rehypeHighlight from "rehype-highlight";

import CommentsSection from "@/src/components/blog/CommentsSection";
import ThemeToggle from "@/src/components/ThemeToggle";
import ViewCounter from "@/src/components/ViewCounter";
import { BlogPost } from "@/src/lib/blog";

interface BlogPostDetailProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
  next: BlogPost | null;
  prev: BlogPost | null;
}

export default function BlogPostDetail({ post, relatedPosts, next, prev }: BlogPostDetailProps) {
  // Auto-generate Table of Contents from headings H2 & H3
  const headings = post.content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const depth = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^#{2,3}\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      return { depth, text, id };
    });

  // Custom MDX Components for Minimalist Monochromatic Layout
  const components = {
    h2: ({ children }: any) => {
      const text = typeof children === "string" ? children : children?.toString() || "";
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      return (
        <h2 id={id} className="text-2xl font-bold mt-10 mb-4 border-b border-zinc-200 dark:border-zinc-900 pb-2 text-zinc-900 dark:text-white tracking-tight">
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const text = typeof children === "string" ? children : children?.toString() || "";
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      return (
        <h3 id={id} className="text-xl font-bold mt-8 mb-3 text-zinc-800 dark:text-zinc-100 tracking-tight">
          {children}
        </h3>
      );
    },
    p: ({ children }: any) => (
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-light">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-6 text-zinc-650 dark:text-zinc-450 space-y-2 font-light">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-6 text-zinc-650 dark:text-zinc-450 space-y-2 font-light">
        {children}
      </ol>
    ),
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-zinc-350 dark:border-zinc-700 pl-4 italic text-zinc-550 dark:text-zinc-500 my-6 bg-zinc-100 dark:bg-zinc-950/20 py-3 pr-3 rounded-r-lg">
        {children}
      </blockquote>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-zinc-100 dark:bg-[#050505] border border-zinc-200 dark:border-zinc-900 rounded-xl p-4 overflow-x-auto text-zinc-850 dark:text-zinc-350 text-sm my-6 scrollbar-thin">
        {children}
      </pre>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-zinc-900 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black-100 text-zinc-750 dark:text-zinc-300 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            ← Góc Chia Sẻ
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link href="/forum" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Forum
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Blog Post Content Area */}
        <main className="lg:col-span-3">
          {/* Post Header */}
          <header className="mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-900">
            <div className="flex items-center space-x-3 text-xs text-zinc-450 dark:text-zinc-500 mb-4 font-mono">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <ViewCounter slug={post.slug} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-4xl leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-450 text-lg leading-relaxed font-light italic mb-6">
              {post.description}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-850 text-zinc-650 dark:text-zinc-450 rounded-lg text-[10px] uppercase font-mono tracking-wider font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Render MDX Content */}
          <div className="prose prose-invert max-w-none">
            <MDXRemote
              source={post.content}
              components={components}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeHighlight],
                },
              }}
            />
          </div>

          {/* Next / Previous Article Navigation */}
          {(next || prev) && (
            <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex flex-col items-start bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl hover:border-zinc-350 dark:hover:border-zinc-800 hover:shadow-md transition-all duration-300"
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-550 group-hover:text-zinc-650 dark:group-hover:text-zinc-400 transition-colors mb-2">
                    Bài trước đó
                  </span>
                  <span className="text-sm font-bold text-zinc-905 dark:text-white group-hover:text-zinc-650 dark:group-hover:text-zinc-200 transition-colors">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div className="border border-dashed border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl bg-zinc-100/50 dark:bg-zinc-950/20 text-center flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-600 font-light">
                  Không còn bài viết cũ hơn.
                </div>
              )}

              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex flex-col items-end text-right bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl hover:border-zinc-350 dark:hover:border-zinc-800 hover:shadow-md transition-all duration-300"
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 dark:text-zinc-550 group-hover:text-zinc-650 dark:group-hover:text-zinc-400 transition-colors mb-2">
                    Bài kế tiếp
                  </span>
                  <span className="text-sm font-bold text-zinc-905 dark:text-white group-hover:text-zinc-650 dark:group-hover:text-zinc-200 transition-colors">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div className="border border-dashed border-zinc-200 dark:border-zinc-900 p-5 rounded-2xl bg-zinc-100/50 dark:bg-zinc-950/20 text-center flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-600 font-light">
                  Bạn đang ở bài viết mới nhất.
                </div>
              )}
            </div>
          )}

          {/* Suggested Posts Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900">
              <h3 className="text-xs font-mono font-bold text-zinc-450 dark:text-zinc-550 mb-6 uppercase tracking-widest">
                Có thể bạn quan tâm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.slug}
                    className="group relative bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-5 hover:border-zinc-350 dark:hover:border-zinc-800 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="absolute inset-0 z-10"
                    />
                    <div>
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-550 mb-2">
                        <span>{relatedPost.date}</span>
                        <span>•</span>
                        <span>{relatedPost.readingTime}</span>
                      </div>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-zinc-650 dark:group-hover:text-zinc-300 transition-colors mb-2 line-clamp-1">
                        {relatedPost.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-450 text-xs leading-relaxed line-clamp-2 font-light">
                        {relatedPost.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <CommentsSection slug={post.slug} />
        </main>

        {/* Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            {headings.length > 0 && (
              <div>
                <h3 className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-550 font-mono font-bold mb-4">
                  Mục lục bài viết
                </h3>
                <nav className="space-y-3 text-xs border-l border-zinc-250 dark:border-zinc-900 pl-4 font-mono">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      className={`block transition-colors hover:text-zinc-950 dark:hover:text-white ${
                        heading.depth === 3
                          ? "pl-4 text-zinc-400 dark:text-zinc-600"
                          : "text-zinc-500"
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
            <div>
              <h3 className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-550 font-mono font-bold mb-3">
                Chia sẻ
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-600 leading-relaxed font-light">
                Nếu bài viết này giúp ích cho bạn, hãy sao chép liên kết trang web này và chia sẻ cho bạn bè nhé!
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-8 bg-zinc-100 dark:bg-[#050505] mt-24">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-zinc-450 dark:text-zinc-600">
          © {new Date().getFullYear()} Portfolio. Built with Next.js 14 (Monochromatic Minimalist).
        </div>
      </footer>
    </div>
  );
}

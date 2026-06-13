import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import Experience from "@/src/components/Experience";
import TechStack from "@/src/components/TechStack";
import ThemeToggle from "@/src/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Giới Thiệu - Về Tôi & Hành Trình",
  description: "Trang giới thiệu bản thân, triết lý sống, sở thích cá nhân và trục thời gian sự nghiệp, học vấn của tôi.",
  openGraph: {
    title: "Giới Thiệu - Về Tôi & Hành Trình",
    description: "Trang giới thiệu bản thân, triết lý sống, sở thích cá nhân và trục thời gian sự nghiệp, học vấn của tôi.",
    type: "website",
  },
};

export default function AboutPage() {
  const timelineMilestones = [
    {
      period: "2022 - Hiện tại",
      title: "Senior Frontend Developer",
      organization: "Tech Solutions Inc.",
      type: "career",
      description: "Dẫn dắt phát triển hệ thống e-commerce quy mô lớn bằng Next.js & TypeScript. Tối ưu hiệu năng, cải thiện trải nghiệm người dùng và hướng dẫn đội ngũ phát triển trẻ.",
    },
    {
      period: "2020 - 2022",
      title: "Full Stack Developer",
      organization: "Digital Innovations Ltd",
      type: "career",
      description: "Xây dựng các ứng dụng web phức tạp, thiết kế cơ sở dữ liệu PostgreSQL và triển khai các API hiệu năng cao với Node.js & Express.",
    },
    {
      period: "2018 - 2020",
      title: "Web Developer",
      organization: "Creative Agency",
      type: "career",
      description: "Hợp tác chặt chẽ với các UI/UX designers để chuyển tải bản vẽ thành giao diện web pixel-perfect, tối ưu SEO và tốc độ tải trang.",
    },
    {
      period: "2014 - 2018",
      title: "Cử Nhân Khoa Học Máy Tính",
      organization: "Đại Học Công Nghệ & Kỹ Thuật",
      type: "education",
      description: "Tốt nghiệp loại Ưu. Đạt giải thưởng nghiên cứu khoa học sinh viên ngành Kỹ thuật phần mềm.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black-100 text-zinc-800 dark:text-zinc-300 font-sans selection:bg-zinc-250 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-900 bg-white/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white hover:text-zinc-550 dark:hover:text-zinc-400 transition-colors"
          >
            ← Portfolio
          </Link>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-zinc-950 dark:text-white border-b border-zinc-950 dark:border-white pb-0.5 font-medium">About</span>
            <Link href="/projects" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Blog
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 md:text-5xl">
            Về Bản Thân Tôi
          </h1>
          <p className="text-zinc-650 dark:text-zinc-450 text-lg leading-relaxed max-w-3xl font-light">
            Tôi là một nhà phát triển phần mềm đam mê sự đơn giản, tính hiệu quả và cái đẹp tối giản trong cả thiết kế giao diện lẫn mã nguồn. Với hơn 6 năm kinh nghiệm trong việc xây dựng các ứng dụng web chất lượng cao, tôi không chỉ viết code mà còn tạo nên những trải nghiệm số tinh tế và ý nghĩa.
          </p>
        </section>

        {/* Philosophy & Hobbies Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 hover:border-zinc-400 dark:hover:border-zinc-800 transition-all shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">Triết Lý Sống & Làm Việc</h3>
            <p className="text-zinc-650 dark:text-zinc-450 text-sm leading-relaxed font-light">
              &ldquo;Ít hơn tức là nhiều hơn&rdquo; (Less is more). Tôi tin rằng giao diện tốt nhất là giao diện không thừa thãi, dòng code tốt nhất là dòng code ngắn gọn và dễ hiểu nhất. Tôi luôn theo đuổi sự tối giản tuyệt đối để người dùng có thể hoàn toàn tập trung vào giá trị cốt lõi của nội dung và sản phẩm.
            </p>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-2xl p-8 hover:border-zinc-400 dark:hover:border-zinc-800 transition-all shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">Sở Thích Cá Nhân</h3>
            <p className="text-zinc-650 dark:text-zinc-450 text-sm leading-relaxed font-light">
              Ngoài thời gian ngồi trước màn hình máy tính, tôi thích đọc sách về chủ nghĩa khắc kỷ (Stoicism), trải nghiệm cà phê phin nguyên chất vào mỗi buổi sáng, tham gia đạp xe đường dài và chụp ảnh đen trắng đường phố để lưu giữ những khoảnh khắc đời thường mộc mạc nhất.
            </p>
          </div>
        </section>

        {/* Tech Stack Component Integrated */}
        <section id="tech-stack" className="mb-20">
          <TechStack />
        </section>

        {/* Experience Component Integrated */}
        <section id="experience" className="mb-20">
          <Experience />
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-10 tracking-tight uppercase font-mono text-sm tracking-widest text-zinc-500 dark:text-zinc-500">
            Hành Trình Sự Nghiệp & Học Vấn
          </h2>
          
          <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 space-y-12">
            {timelineMilestones.map((milestone, idx) => (
              <div key={idx} className="relative pl-8 group">
                {/* Timeline Node Dot */}
                <span className="absolute -left-[5px] top-1.5 flex h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-850 border border-zinc-400 dark:border-zinc-700 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:scale-125 transition-all duration-300" />
                
                {/* Milestone Info */}
                <div>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                    {milestone.period} &bull; {milestone.type === "career" ? "Sự Nghiệp" : "Học Vấn"}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-1 group-hover:text-zinc-650 dark:group-hover:text-zinc-200 transition-colors">
                    {milestone.title}
                  </h3>
                  <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
                    {milestone.organization}
                  </h4>
                  <p className="text-zinc-550 dark:text-zinc-500 text-sm leading-relaxed max-w-2xl font-light">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-900 py-8 bg-zinc-100 dark:bg-[#050505] mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-zinc-550 dark:text-zinc-600">
          © {new Date().getFullYear()} Portfolio. Built with Next.js 14 (Monochromatic Minimalist).
        </div>
      </footer>
    </div>
  );
}

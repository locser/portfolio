import { Metadata } from "next";
import React from "react";

import { projects } from "@/src/config/data";

import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects - Các Dự Án Nổi Bật",
  description: "Trang tổng hợp và tìm kiếm tất cả các dự án, ứng dụng web, thư viện mã nguồn mở và thiết kế kỹ thuật của tôi.",
  openGraph: {
    title: "Projects - Các Dự Án Nổi Bật",
    description: "Trang tổng hợp và tìm kiếm tất cả các dự án, ứng dụng web, thư viện mã nguồn mở và thiết kế kỹ thuật của tôi.",
    type: "website",
  },
};

export default function ProjectsPage() {
  return <ProjectsClient initialProjects={projects} />;
}
export const revalidate = 3600; // Revalidate every hour

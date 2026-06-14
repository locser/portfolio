import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/src/lib/auth";

const postsDirectory = path.join(process.cwd(), "src/data/posts");

// Vietnamese slugify helper function
function slugify(text: string): string {
  let str = text.toLowerCase();
  
  // Remove Vietnamese accents
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  
  // Remove special characters and punctuation
  str = str.replace(/[^a-z0-9\s-]/g, "");
  
  // Replace multiple spaces with a single space, then replace spaces with hyphens
  str = str.trim().replace(/\s+/g, "-");
  
  return str;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authorize Admin Session
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Bạn không có quyền thực hiện hành động này (Chưa đăng nhập)" },
        { status: 450 } // Next.js specific or 401
      );
    }

    const session = verifySessionToken(sessionToken);
    if (!session) {
      return NextResponse.json(
        { error: "Phiên làm việc không hợp lệ hoặc đã hết hạn" },
        { status: 403 }
      );
    }

    // 2. Parse and validate body
    const body = await request.json();
    const { title, description, coverImage, tags, content } = body;

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Tiêu đề, mô tả và nội dung bài viết là bắt buộc" },
        { status: 400 }
      );
    }

    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    // 3. Generate unique slug
    let slug = slugify(title);
    if (!slug) {
      slug = `post-${Date.now()}`;
    }

    let fullPath = path.join(postsDirectory, `${slug}.md`);

    // Handle collision by appending a unique timestamp suffix
    if (fs.existsSync(fullPath)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
      fullPath = path.join(postsDirectory, `${slug}.md`);
    }

    // 4. Format Frontmatter & Content
    const currentDate = new Date().toISOString().split("T")[0];
    const tagList = Array.isArray(tags) ? tags : [];

    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${currentDate}"
description: "${description.replace(/"/g, '\\"')}"
tags: ${JSON.stringify(tagList)}
coverImage: "${coverImage.replace(/"/g, '\\"')}"
---
${content}
`;

    // 5. Write file
    fs.writeFileSync(fullPath, fileContent, "utf8");

    return NextResponse.json({
      success: true,
      message: "Tạo bài viết mới thành công",
      slug,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi lưu bài viết mới" },
      { status: 500 }
    );
  }
}

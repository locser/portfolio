import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/src/lib/auth";

const postsDirectory = path.join(process.cwd(), "src/data/posts");
const viewsFilePath = path.join(process.cwd(), "src/data/post-views.json");

export async function DELETE(request: NextRequest) {
  try {
    // 1. Authorize Admin Session
    const sessionToken = request.cookies.get("admin_session")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Bạn không có quyền thực hiện hành động này (Chưa đăng nhập)" },
        { status: 401 }
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
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug bài viết là bắt buộc để thực hiện xóa" },
        { status: 400 }
      );
    }

    // Secure check to prevent directory traversal
    const safeSlugPattern = /^[a-z0-9-]+$/;
    if (!safeSlugPattern.test(slug)) {
      return NextResponse.json(
        { error: "Định dạng slug bài viết không hợp lệ" },
        { status: 400 }
      );
    }

    // 3. Delete markdown file
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: "Bài viết không tồn tại hoặc đã bị xóa trước đó" },
        { status: 404 }
      );
    }

    fs.unlinkSync(fullPath);

    // 4. Clean up post views database (JSON file)
    try {
      if (fs.existsSync(viewsFilePath)) {
        const fileContent = fs.readFileSync(viewsFilePath, "utf8") || "{}";
        const views: Record<string, number> = JSON.parse(fileContent);
        
        if (slug in views) {
          delete views[slug];
          fs.writeFileSync(viewsFilePath, JSON.stringify(views, null, 2), "utf8");
        }
      }
    } catch (viewsError) {
      console.error("Failed to clean up post views during deletion:", viewsError);
      // We don't fail the entire request if just the views cleanup fails,
      // but we log it.
    }

    return NextResponse.json({
      success: true,
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xóa bài viết" },
      { status: 500 }
    );
  }
}

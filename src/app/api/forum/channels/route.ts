import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/src/lib/auth";
import { getChannels, saveChannels, getTopics, saveTopics, getReplies, saveReplies, Channel } from "@/src/lib/forum";

// 1. Helper to verify admin authority
function checkAdminAuth(request: NextRequest): boolean {
  const sessionToken = request.cookies.get("admin_session")?.value;
  if (!sessionToken) return false;
  const session = verifySessionToken(sessionToken);
  return !!session;
}

// 2. GET: Get all channels
export async function GET() {
  try {
    const channels = getChannels();
    return NextResponse.json(channels);
  } catch (error) {
    console.error("GET channels error:", error);
    return NextResponse.json({ error: "Lỗi khi tải danh mục diễn đàn" }, { status: 500 });
  }
}

// 3. POST: Create a channel (Admin only)
export async function POST(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Không được phép truy cập (Yêu cầu quyền Admin)" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, allowPublicTopics } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Tiêu đề và mô tả là bắt buộc" }, { status: 400 });
    }

    const channels = getChannels();
    const id = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);

    const newChannel: Channel = {
      id,
      title,
      description,
      allowPublicTopics: allowPublicTopics !== false,
      createdAt: new Date().toISOString(),
    };

    channels.push(newChannel);
    saveChannels(channels);

    return NextResponse.json({ success: true, channel: newChannel });
  } catch (error) {
    console.error("POST channel error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo danh mục mới" }, { status: 500 });
  }
}

// 4. PUT: Update a channel (Admin only)
export async function PUT(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Không được phép truy cập (Yêu cầu quyền Admin)" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, description, allowPublicTopics } = body;

    if (!id || !title || !description) {
      return NextResponse.json({ error: "Thiếu thông tin cập nhật" }, { status: 400 });
    }

    const channels = getChannels();
    const index = channels.findIndex((c) => c.id === id);

    const existing = channels[index];
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy danh mục yêu cầu" }, { status: 404 });
    }

    channels[index] = {
      id: existing.id,
      createdAt: existing.createdAt,
      title,
      description,
      allowPublicTopics: allowPublicTopics !== false,
    };

    saveChannels(channels);

    return NextResponse.json({ success: true, channel: channels[index] });
  } catch (error) {
    console.error("PUT channel error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi cập nhật danh mục" }, { status: 500 });
  }
}

// 5. DELETE: Delete a channel and its contents (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    if (!checkAdminAuth(request)) {
      return NextResponse.json({ error: "Không được phép truy cập (Yêu cầu quyền Admin)" }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Mã danh mục là bắt buộc" }, { status: 400 });
    }

    const channels = getChannels();
    const filteredChannels = channels.filter((c) => c.id !== id);

    if (channels.length === filteredChannels.length) {
      return NextResponse.json({ error: "Không tìm thấy danh mục" }, { status: 404 });
    }

    // 1. Delete Channel
    saveChannels(filteredChannels);

    // 2. Cascade delete Topics of this channel
    const topicsMap = getTopics();
    const channelTopics = topicsMap[id] || [];
    delete topicsMap[id];
    saveTopics(topicsMap);

    // 3. Cascade delete Replies of all topics inside this channel
    const repliesMap = getReplies();
    channelTopics.forEach((t) => {
      delete repliesMap[t.id];
    });
    saveReplies(repliesMap);

    return NextResponse.json({ success: true, message: "Xóa danh mục thành công" });
  } catch (error) {
    console.error("DELETE channel error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xóa danh mục" }, { status: 500 });
  }
}

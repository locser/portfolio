import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/src/lib/auth";
import { getChannels, getTopics, saveTopics, Topic } from "@/src/lib/forum";
import { withMetrics } from "@/src/lib/metrics";



// Helper to verify admin authority
function checkAdminAuth(request: NextRequest): boolean {
  const sessionToken = request.cookies.get("admin_session")?.value;
  if (!sessionToken) return false;
  const session = verifySessionToken(sessionToken);
  return !!session;
}

// 1. GET: Retrieve topics for a specific channel
async function getHandler(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const channelId = url.searchParams.get("channelId");
    const sort = url.searchParams.get("sort") || "newest"; // upvotes | newest

    if (!channelId) {
      return NextResponse.json({ error: "Yêu cầu mã danh mục (channelId)" }, { status: 400 });
    }

    const topicsMap = getTopics();
    const topicsList = topicsMap[channelId] || [];

    // Sorting logic
    if (sort === "upvotes") {
      topicsList.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes;
        const scoreB = b.upvotes - b.downvotes;
        return scoreB - scoreA;
      });
    } else {
      // Default: newest
      topicsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json(topicsList);
  } catch (error) {
    console.error("GET topics error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải chủ đề thảo luận" }, { status: 500 });
  }
}

export const GET = withMetrics(getHandler, '/api/forum/topics', 'GET');

// 2. POST: Create a new topic in a channel
async function postHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId, title, authorName, content } = body;

    if (!channelId || !title || !authorName || !content) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc để đăng chủ đề" }, { status: 400 });
    }

    // Validate if the channel exists
    const channels = getChannels();
    const channel = channels.find((c) => c.id === channelId);

    if (!channel) {
      return NextResponse.json({ error: "Không tìm thấy danh mục yêu cầu" }, { status: 404 });
    }

    // Permission check: if channel is admin-only (allowPublicTopics = false)
    if (!channel.allowPublicTopics) {
      if (!checkAdminAuth(request)) {
        return NextResponse.json(
          { error: "Danh mục này bị hạn chế. Chỉ quản trị viên mới được phép đăng chủ đề." },
          { status: 403 }
        );
      }
    }

    const topicsMap = getTopics();
    const channelTopics = topicsMap[channelId] || [];

    const id = "topic-" + Date.now() + "-" + Math.random().toString(36).slice(-4);
    const newTopic: Topic = {
      id,
      channelId,
      title,
      authorName,
      content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      views: 0,
      replyCount: 0,
    };

    channelTopics.push(newTopic);
    topicsMap[channelId] = channelTopics;
    saveTopics(topicsMap);

    return NextResponse.json({ success: true, topic: newTopic });
  } catch (error) {
    console.error("POST topic error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi đăng chủ đề mới" }, { status: 500 });
  }
}

export const POST = withMetrics(postHandler, '/api/forum/topics', 'POST');

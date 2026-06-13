import { NextRequest, NextResponse } from "next/server";

import { getReplies, saveReplies, getTopics, saveTopics, Reply } from "@/src/lib/forum";

// 1. GET: Retrieve replies/comments for a topic
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const topicId = url.searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ error: "Yêu cầu mã chủ đề (topicId)" }, { status: 400 });
    }

    const repliesMap = getReplies();
    const topicReplies = repliesMap[topicId] || [];

    // Sort replies by oldest first (chronological thread)
    topicReplies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return NextResponse.json(topicReplies);
  } catch (error) {
    console.error("GET replies error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải phản hồi" }, { status: 500 });
  }
}

// 2. POST: Post a reply to a topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId, topicId, authorName, authorEmail, content } = body;

    if (!channelId || !topicId || !authorName || !content) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc để gửi phản hồi" }, { status: 400 });
    }

    const repliesMap = getReplies();
    const topicReplies = repliesMap[topicId] || [];

    const id = "reply-" + Date.now() + "-" + Math.random().toString(36).slice(-4);
    const newReply: Reply = {
      id,
      authorName,
      authorEmail: authorEmail || undefined,
      content,
      createdAt: new Date().toISOString(),
    };

    // 1. Append reply
    topicReplies.push(newReply);
    repliesMap[topicId] = topicReplies;
    saveReplies(repliesMap);

    // 2. Increment replyCount inside Topic in topics.json
    const topicsMap = getTopics();
    const channelTopics = topicsMap[channelId] || [];
    const topicIndex = channelTopics.findIndex((t) => t.id === topicId);

    if (topicIndex !== -1) {
      const topic = channelTopics[topicIndex];
      if (topic) {
        topic.replyCount = (topic.replyCount || 0) + 1;
        channelTopics[topicIndex] = topic;
        topicsMap[channelId] = channelTopics;
        saveTopics(topicsMap);
      }
    }

    return NextResponse.json({ success: true, reply: newReply });
  } catch (error) {
    console.error("POST reply error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi gửi phản hồi" }, { status: 500 });
  }
}

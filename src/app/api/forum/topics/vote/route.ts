import { NextRequest, NextResponse } from "next/server";

import { getTopics, saveTopics } from "@/src/lib/forum";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId, topicId, direction } = body; // direction is 'up' | 'down'

    if (!channelId || !topicId || !direction || (direction !== "up" && direction !== "down")) {
      return NextResponse.json({ error: "Tham số bình chọn không hợp lệ" }, { status: 400 });
    }

    const topicsMap = await getTopics();
    const channelTopics = topicsMap[channelId] || [];
    const topicIndex = channelTopics.findIndex((t) => t.id === topicId);

    const topic = channelTopics[topicIndex];
    if (!topic) {
      return NextResponse.json({ error: "Không tìm thấy chủ đề cần bình chọn" }, { status: 404 });
    }

    if (direction === "up") {
      topic.upvotes = (topic.upvotes || 0) + 1;
    } else {
      topic.downvotes = (topic.downvotes || 0) + 1;
    }

    channelTopics[topicIndex] = topic;
    topicsMap[channelId] = channelTopics;
    await saveTopics(topicsMap);

    return NextResponse.json({
      success: true,
      upvotes: topic.upvotes,
      downvotes: topic.downvotes,
      netScore: topic.upvotes - topic.downvotes,
    });
  } catch (error) {
    console.error("POST vote error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi bình chọn" }, { status: 500 });
  }
}

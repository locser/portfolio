import { NextRequest, NextResponse } from "next/server";

import { getTopics, saveTopics } from "@/src/lib/forum";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const channelId = url.searchParams.get("channelId");
    const topicId = url.searchParams.get("topicId");

    if (!channelId || !topicId) {
      return NextResponse.json({ error: "Yêu cầu mã danh mục và mã chủ đề" }, { status: 400 });
    }

    const topicsMap = getTopics();
    const channelTopics = topicsMap[channelId] || [];
    const topicIndex = channelTopics.findIndex((t) => t.id === topicId);

    const topic = channelTopics[topicIndex];
    if (!topic) {
      return NextResponse.json({ error: "Không tìm thấy chủ đề chi tiết" }, { status: 404 });
    }
    
    // Auto increment views
    topic.views = (topic.views || 0) + 1;
    channelTopics[topicIndex] = topic;
    topicsMap[channelId] = channelTopics;
    saveTopics(topicsMap);

    return NextResponse.json(topic);
  } catch (error) {
    console.error("GET topic detail error:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tải chi tiết chủ đề" }, { status: 500 });
  }
}

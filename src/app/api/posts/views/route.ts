import { NextRequest, NextResponse } from "next/server";

import { getDatabase } from "@/src/lib/mongodb";

// GET /api/posts/views
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const db = await getDatabase();
    const collection = db.collection("post_views");

    if (slug) {
      const doc = await collection.findOne({ _id: slug as any });
      const postViews = doc ? (doc.views as number) : 0;
      return NextResponse.json({ slug, views: postViews });
    }

    const docs = await collection.find().toArray();
    const viewsMap: Record<string, number> = {};
    docs.forEach((doc) => {
      viewsMap[doc._id.toString()] = doc.views as number;
    });

    return NextResponse.json(viewsMap);
  } catch (error) {
    console.error("GET views error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/posts/views
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("post_views");

    // Atomic increment
    await collection.updateOne(
      { _id: slug as any },
      { $inc: { views: 1 } },
      { upsert: true }
    );

    const doc = await collection.findOne({ _id: slug as any });
    const newViews = doc ? (doc.views as number) : 1;

    return NextResponse.json({ success: true, slug, views: newViews });
  } catch (error) {
    console.error("Error in views POST API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

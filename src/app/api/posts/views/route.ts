import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

const viewsFilePath = path.join(process.cwd(), "src/data/post-views.json");

// Helper function to read views safely
function readViews(): Record<string, number> {
  try {
    if (!fs.existsSync(viewsFilePath)) {
      fs.writeFileSync(viewsFilePath, JSON.stringify({}), "utf8");
      return {};
    }
    const content = fs.readFileSync(viewsFilePath, "utf8");
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Error reading views file:", error);
    return {};
  }
}

// Helper function to write views safely
function writeViews(views: Record<string, number>): boolean {
  try {
    fs.writeFileSync(viewsFilePath, JSON.stringify(views, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing views file:", error);
    return false;
  }
}

// GET /api/posts/views
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const views = readViews();

  if (slug) {
    const postViews = views[slug] || 0;
    return NextResponse.json({ slug, views: postViews });
  }

  return NextResponse.json(views);
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

    const views = readViews();
    const currentViews = views[slug] || 0;
    const newViews = currentViews + 1;
    views[slug] = newViews;

    const success = writeViews(views);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update views count" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug, views: newViews });
  } catch (error) {
    console.error("Error in views POST API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

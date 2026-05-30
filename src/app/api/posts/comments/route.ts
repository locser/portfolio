import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { sanitizeInput } from "@/src/lib/utils";

const commentsFilePath = path.join(process.cwd(), "src/data/post-comments.json");

interface Comment {
  id: string;
  slug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

interface ThreadedComment extends Comment {
  replies: Comment[];
}

// Helper to read comments safely
function readComments(): Record<string, Comment[]> {
  try {
    if (!fs.existsSync(commentsFilePath)) {
      fs.writeFileSync(commentsFilePath, JSON.stringify({}), "utf8");
      return {};
    }
    const content = fs.readFileSync(commentsFilePath, "utf8");
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Error reading comments file:", error);
    return {};
  }
}

// Helper to write comments safely
function writeComments(comments: Record<string, Comment[]>): boolean {
  try {
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing comments file:", error);
    return false;
  }
}

// GET /api/posts/comments?slug=<slug>
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const allComments = readComments();
    const postComments = allComments[slug] || [];

    // Separate root comments and replies
    const roots = postComments.filter((c) => !c.parentId) as ThreadedComment[];
    const replies = postComments.filter((c) => c.parentId);

    // Group replies under their root comments
    roots.forEach((root) => {
      root.replies = replies
        .filter((reply) => reply.parentId === root.id)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ); // Oldest reply first
    });

    // Sort root comments: oldest root comment first
    roots.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return NextResponse.json(roots);
  } catch (error) {
    console.error("Error in GET comments API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/posts/comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, authorName, authorEmail, content, parentId } = body;

    // Validation
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid or missing slug" }, { status: 400 });
    }
    if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    const allComments = readComments();
    const postComments = allComments[slug] || [];

    // Enforce 2-level comment hierarchy limit
    let resolvedParentId: string | null = parentId || null;
    if (resolvedParentId) {
      const parentComment = postComments.find((c) => c.id === resolvedParentId);
      if (parentComment) {
        // If parent has a parentId, it means parent is a Level 2 reply.
        // We re-associate the new comment's parentId to the Level 1 root comment.
        if (parentComment.parentId) {
          resolvedParentId = parentComment.parentId;
        }
      } else {
        // Parent ID was specified but not found in this post, set to null
        resolvedParentId = null;
      }
    }

    // Generate unique ID
    const newId = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

    // Create and sanitize comment
    const newComment: Comment = {
      id: newId,
      slug,
      authorName: sanitizeInput(authorName.trim()),
      authorEmail: authorEmail ? sanitizeInput(authorEmail.trim()) : undefined,
      content: sanitizeInput(content.trim()),
      parentId: resolvedParentId,
      createdAt: new Date().toISOString(),
    };

    postComments.push(newComment);
    allComments[slug] = postComments;

    const success = writeComments(allComments);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to persist comment" },
        { status: 500 }
      );
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error in POST comments API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

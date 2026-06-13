import fs from "fs";

import { NextRequest } from "next/server";

import { GET, POST } from "./route";

jest.mock("fs");

describe("Comments API", () => {
  let fileMockStorage: Record<string, any> = {};

  beforeEach(() => {
    fileMockStorage = {};
    jest.clearAllMocks();

    // Mock fs.existsSync to return true
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      return JSON.stringify(fileMockStorage);
    });

    // Mock fs.writeFileSync
    (fs.writeFileSync as jest.Mock).mockImplementation((path, data) => {
      fileMockStorage = JSON.parse(data);
      return true;
    });
  });

  describe("GET /api/posts/comments", () => {
    it("should return empty array when there are no comments for the slug", async () => {
      const req = new NextRequest("http://localhost/api/posts/comments?slug=test-post");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("should return sorted comments when comments exist", async () => {
      // Setup mock data
      fileMockStorage = {
        "test-post": [
          {
            id: "1",
            slug: "test-post",
            authorName: "Alice",
            content: "First root comment",
            parentId: null,
            createdAt: new Date("2026-05-30T10:00:00.000Z").toISOString(),
          },
          {
            id: "2",
            slug: "test-post",
            authorName: "Bob",
            content: "Reply to first comment",
            parentId: "1",
            createdAt: new Date("2026-05-30T10:05:00.000Z").toISOString(),
          },
          {
            id: "3",
            slug: "test-post",
            authorName: "Charlie",
            content: "Second root comment",
            parentId: null,
            createdAt: new Date("2026-05-30T10:10:00.000Z").toISOString(),
          },
        ],
      };

      const req = new NextRequest("http://localhost/api/posts/comments?slug=test-post");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      // Root comments should be oldest first (Alice then Charlie)
      expect(data[0].id).toBe("1");
      expect(data[1].id).toBe("3");
      // Alice's root comment should have Bob's reply nested
      expect(data[0].replies).toBeDefined();
      expect(data[0].replies.length).toBe(1);
      expect(data[0].replies[0].id).toBe("2");
    });
  });

  describe("POST /api/posts/comments", () => {
    it("should successfully create a root comment", async () => {
      const req = new NextRequest("http://localhost/api/posts/comments", {
        method: "POST",
        body: JSON.stringify({
          slug: "test-post",
          authorName: "Alice",
          content: "Hello World",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.authorName).toBe("Alice");
      expect(data.content).toBe("Hello World");
      expect(data.parentId).toBeNull();
      expect(data.createdAt).toBeDefined();

      // Check if it's saved in mock storage
      expect(fileMockStorage["test-post"]).toBeDefined();
      expect(fileMockStorage["test-post"].length).toBe(1);
    });

    it("should escape script tags in comments to prevent XSS", async () => {
      const req = new NextRequest("http://localhost/api/posts/comments", {
        method: "POST",
        body: JSON.stringify({
          slug: "test-post",
          authorName: "<script>alert('hack')</script>",
          content: "<img src=x onerror=alert(1)>",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.authorName).toBe("&lt;script&gt;alert(&#x27;hack&#x27;)&lt;&#x2F;script&gt;");
      expect(data.content).toBe("&lt;img src=x onerror=alert(1)&gt;");
    });

    it("should enforce 2-level comment hierarchy limit", async () => {
      // 1. Create a root comment
      fileMockStorage = {
        "test-post": [
          {
            id: "root-1",
            slug: "test-post",
            authorName: "Alice",
            content: "Root comment",
            parentId: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "reply-1",
            slug: "test-post",
            authorName: "Bob",
            content: "Reply to root",
            parentId: "root-1",
            createdAt: new Date().toISOString(),
          },
        ],
      };

      // 2. Submit a reply to the level 2 comment ('reply-1')
      const req = new NextRequest("http://localhost/api/posts/comments", {
        method: "POST",
        body: JSON.stringify({
          slug: "test-post",
          authorName: "Charlie",
          content: "Reply to reply",
          parentId: "reply-1",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      // parentId should be re-associated to 'root-1' instead of 'reply-1' to keep depth at level 2
      expect(data.parentId).toBe("root-1");
    });

    it("should return 400 bad request if required fields are missing", async () => {
      const req = new NextRequest("http://localhost/api/posts/comments", {
        method: "POST",
        body: JSON.stringify({
          slug: "test-post",
          authorName: "", // Empty
          content: "Hello",
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});

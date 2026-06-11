import fs from "fs";

import {
  getPostSlugs,
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
  getNextPrevPosts,
  BlogPost,
} from "./markdown";

jest.mock("fs");

describe("markdown.ts helper functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPostSlugs", () => {
    it("should return empty array if directory does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const slugs = getPostSlugs();
      expect(slugs).toEqual([]);
    });

    it("should return only .md files from directory if it exists", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue([
        "post-1.md",
        "post-2.md",
        "image.png",
        "draft.txt",
      ]);

      const slugs = getPostSlugs();
      expect(slugs).toEqual(["post-1.md", "post-2.md"]);
    });
  });

  describe("getPostBySlug", () => {
    it("should return null if file does not exist", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const post = getPostBySlug("non-existent");
      expect(post).toBeNull();
    });

    it("should parse frontmatter and content correctly and calculate reading time", () => {
      const mockMarkdown = `---
title: "Test Article"
date: "2026-06-11"
description: "A short description"
tags:
  - react
  - testing
coverImage: "/images/test.jpg"
---
This is a test article content containing a few words.
Let's see if it parses correctly.
`;
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(mockMarkdown);

      const post = getPostBySlug("test-article");
      expect(post).not.toBeNull();
      expect(post?.slug).toBe("test-article");
      expect(post?.title).toBe("Test Article");
      expect(post?.date).toBe("2026-06-11");
      expect(post?.description).toBe("A short description");
      expect(post?.tags).toEqual(["react", "testing"]);
      expect(post?.coverImage).toBe("/images/test.jpg");
      expect(post?.content.trim()).toBe("This is a test article content containing a few words.\nLet's see if it parses correctly.");
      expect(post?.readingTime).toBe("1 phút đọc"); // ~12 words -> 1 min reading time
    });

    it("should return default values when frontmatter properties are missing", () => {
      const mockMarkdown = `---
---
Content with no metadata.
`;
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(mockMarkdown);

      const post = getPostBySlug("minimal-post");
      expect(post).not.toBeNull();
      expect(post?.title).toBe("Bài viết không tiêu đề");
      expect(post?.description).toBe("");
      expect(post?.tags).toEqual([]);
      expect(post?.coverImage).toBe("");
      expect(post?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // ISO date part format
    });
  });

  describe("getAllPosts", () => {
    it("should return posts sorted by date in descending order", () => {
      const mockFiles: Record<string, string> = {
        "post-1.md": `---
title: Post One
date: 2026-06-01
---
Content 1`,
        "post-2.md": `---
title: Post Two
date: 2026-06-03
---
Content 2`,
        "post-3.md": `---
title: Post Three
date: 2026-06-02
---
Content 3`,
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue(Object.keys(mockFiles));
      (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
        const basename = filePath.split(/[/\\]/).pop() || "";
        return mockFiles[basename] || "";
      });

      const allPosts = getAllPosts();
      expect(allPosts).toHaveLength(3);
      // Sorted descending: post-2 (June 3), post-3 (June 2), post-1 (June 1)
      expect(allPosts[0].slug).toBe("post-2");
      expect(allPosts[1].slug).toBe("post-3");
      expect(allPosts[2].slug).toBe("post-1");
    });
  });

  describe("getRelatedPosts", () => {
    const mockAllPosts: BlogPost[] = [
      {
        slug: "post-react",
        title: "React Guide",
        date: "2026-06-01",
        description: "",
        tags: ["react", "frontend"],
        content: "",
        readingTime: "1 phút đọc",
      },
      {
        slug: "post-nextjs",
        title: "Next.js Guide",
        date: "2026-06-02",
        description: "",
        tags: ["react", "nextjs", "frontend"],
        content: "",
        readingTime: "1 phút đọc",
      },
      {
        slug: "post-typescript",
        title: "TS Guide",
        date: "2026-06-03",
        description: "",
        tags: ["typescript", "backend"],
        content: "",
        readingTime: "1 phút đọc",
      },
      {
        slug: "post-jest",
        title: "Testing Guide",
        date: "2026-06-04",
        description: "",
        tags: ["testing", "frontend"],
        content: "",
        readingTime: "1 phút đọc",
      },
    ];

    it("should return related posts based on matching tags count (highest score first)", () => {
      const currentPost = mockAllPosts[0]; // Tags: react, frontend
      const related = getRelatedPosts(currentPost, mockAllPosts, 2);

      expect(related).toHaveLength(2);
      // Next.js Guide shares both tags ("react" and "frontend") -> score 2
      expect(related[0].slug).toBe("post-nextjs");
      // Testing Guide shares "frontend" -> score 1
      expect(related[1].slug).toBe("post-jest");
    });

    it("should fallback to latest posts if there are no matching tags", () => {
      const currentPost = mockAllPosts[2]; // TS Guide (Tags: typescript, backend)
      // Others have: react/frontend, react/nextjs/frontend, testing/frontend. 0 matching tags.
      const related = getRelatedPosts(currentPost, mockAllPosts, 2);

      expect(related).toHaveLength(2);
      // Should return the first two non-current posts (which will be React Guide and Next.js Guide)
      expect(related.map(p => p.slug)).not.toContain("post-typescript");
    });
  });

  describe("getNextPrevPosts", () => {
    const mockAllPosts: BlogPost[] = [
      {
        slug: "post-1",
        title: "Post 1",
        date: "2026-06-01",
        description: "",
        tags: [],
        content: "",
        readingTime: "1 phút đọc",
      },
      {
        slug: "post-2",
        title: "Post 2",
        date: "2026-06-02",
        description: "",
        tags: [],
        content: "",
        readingTime: "1 phút đọc",
      },
      {
        slug: "post-3",
        title: "Post 3",
        date: "2026-06-03",
        description: "",
        tags: [],
        content: "",
        readingTime: "1 phút đọc",
      },
    ];

    it("should find next and prev posts in chronological order", () => {
      // Current is post-2
      const result = getNextPrevPosts("post-2", mockAllPosts);
      expect(result.prev?.slug).toBe("post-1"); // Older
      expect(result.next?.slug).toBe("post-3"); // Newer
    });

    it("should return null for prev if current is the oldest post", () => {
      const result = getNextPrevPosts("post-1", mockAllPosts);
      expect(result.prev).toBeNull();
      expect(result.next?.slug).toBe("post-2");
    });

    it("should return null for next if current is the newest post", () => {
      const result = getNextPrevPosts("post-3", mockAllPosts);
      expect(result.prev?.slug).toBe("post-2");
      expect(result.next).toBeNull();
    });

    it("should return nulls if current slug is not found in all posts", () => {
      const result = getNextPrevPosts("unknown", mockAllPosts);
      expect(result.prev).toBeNull();
      expect(result.next).toBeNull();
    });
  });
});

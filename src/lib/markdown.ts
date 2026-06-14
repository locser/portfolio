import fs from "fs";
import path from "path";

import matter from "gray-matter";


export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  coverImage?: string;
  content: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), "src/data/posts");

/**
 * Lấy tất cả các slugs bài viết (tên file bỏ đuôi .md)
 */
export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
  } catch (error) {
    console.error("Lỗi khi đọc danh sách slug bài viết:", error);
    return [];
  }
}

/**
 * Lấy chi tiết một bài viết theo slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Tính toán thời gian đọc (khoảng 200 từ mỗi phút)
    const words = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(words / 200);
    const readingTime = `${readingTimeMinutes} phút đọc`;

    return {
      slug: realSlug,
      title: data.title || "Bài viết không tiêu đề",
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage || "",
      content,
      readingTime,
    };
  } catch (error) {
    console.error(`Lỗi khi đọc bài viết ${slug}:`, error);
    return null;
  }
}

/**
 * Lấy tất cả bài viết, sắp xếp theo ngày đăng mới nhất
 */
export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null);

  // Sắp xếp bài viết theo ngày giảm dần (mới nhất trước)
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

/**
 * Tìm kiếm các bài viết liên quan (Suggested Posts) dựa trên số lượng tag trùng khớp nhiều nhất
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit = 2
): BlogPost[] {
  try {
    // Lọc bỏ bài viết hiện tại
    const otherPosts = allPosts.filter((post) => post.slug !== currentPost.slug);

    const scoredPosts = otherPosts.map((post) => {
      // Đếm số lượng tag trùng
      const matchingTagsCount = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      ).length;

      return { post, score: matchingTagsCount };
    });

    // Sắp xếp theo score giảm dần (ưu tiên trùng tag nhiều nhất), sau đó theo ngày giảm dần
    const sorted = scoredPosts.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return a.post.date > b.post.date ? -1 : 1;
    });

    // Trả về danh sách bài viết gợi ý
    const related = sorted.map((item) => item.post).slice(0, limit);

    // Nếu không có bài viết liên quan trùng tag nào, lấy các bài viết mới nhất
    if (related.length === 0 && otherPosts.length > 0) {
      return otherPosts.slice(0, limit);
    }

    return related;
  } catch (error) {
    console.error("Lỗi khi lấy bài viết gợi ý:", error);
    return [];
  }
}

/**
 * Lấy bài viết liền kề phía trước và phía sau (Next/Prev Posts) dựa trên ngày đăng
 */
export function getNextPrevPosts(
  currentSlug: string,
  allPosts: BlogPost[]
): { next: BlogPost | null; prev: BlogPost | null } {
  try {
    // Sắp xếp bài viết theo ngày tăng dần (cũ nhất trước, mới nhất sau) để xác định thứ tự tuyến tính
    const chronologicalPosts = [...allPosts].sort((a, b) =>
      a.date > b.date ? 1 : -1
    );

    const currentIndex = chronologicalPosts.findIndex(
      (post) => post.slug === currentSlug
    );

    if (currentIndex === -1) {
      return { next: null, prev: null };
    }

    const prev = currentIndex > 0 ? (chronologicalPosts[currentIndex - 1] ?? null) : null;
    const next =
      currentIndex < chronologicalPosts.length - 1
        ? (chronologicalPosts[currentIndex + 1] ?? null)
        : null;

    return { next, prev };
  } catch (error) {
    console.error("Lỗi khi tìm bài viết liền kề (Next/Prev):", error);
    return { next: null, prev: null };
  }
}

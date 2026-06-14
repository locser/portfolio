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

export interface BlogComment {
  id: string;
  slug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

export interface ThreadedBlogComment extends BlogComment {
  replies: BlogComment[];
}

## Context

Our portfolio is a Next.js (App Router) TypeScript application. The site's blog currently displays articles statically. Page views are saved in a local JSON file (`src/data/post-views.json`) using simple File System (fs) operations. 

We want to add a comments system that allows anonymous readers to leave comments and replies without logging in. To minimize overhead and stay consistent with the existing portfolio codebase, we will store comments in a new local JSON file, `src/data/post-comments.json`.

## Goals / Non-Goals

**Goals:**
- Provide a robust local storage mechanism for blog post comments using a local JSON file.
- Design a high-performing Next.js API Route (`GET`/`POST`) at `/api/posts/comments` to manage comment retrieval and submission.
- Ensure strict 2-level comment nesting (Root comment -> Reply) by auto-flattening or re-associating nested replies to the root level.
- Clean and sanitize input to prevent Cross-Site Scripting (XSS) attacks.
- Create a premium-grade, interactive, and visually stunning client-side comment interface using Tailwind CSS under each blog post.

**Non-Goals:**
- **User Authentication**: Readers do not need to log in or register. They only need to provide a name.
- **Email Dispatching**: Although users can optionally input an email address to receive notifications, the actual logic for sending emails (Nodemailer, SendGrid, etc.) will be deferred to a later feature iteration. We will only store the optional email address.
- **Moderation Panel**: There is no admin UI to moderate comments in this change; comments are published immediately upon submission.

## Decisions

### 1. Data Schema & File Structure
We will store all comments in a single flat or nested list structure in `src/data/post-comments.json`.
A flat structure mapped by post `slug` makes querying and insertion very fast:
```typescript
interface Comment {
  id: string;
  slug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  parentId: string | null; // null if root, or the root comment ID
  createdAt: string; // ISO 8601 string
}
// Schema of src/data/post-comments.json
type PostCommentsData = Record<string, Comment[]>;
```

### 2. Nesting Level Enforcement
The requirement is that replies are limited to 2 levels.
- Level 1: Root comments (`parentId === null`).
- Level 2: Replies to root comments (`parentId === rootCommentId`).
- To enforce this on the server side:
  - If a incoming reply contains a `parentId` which itself has a parent (i.e. it points to a Level 2 comment), we will fetch the parent comment and use its `parentId` as the `parentId` of the new comment.
  - This ensures all comments under a root comment are kept flat at Level 2, avoiding infinite nested threads.

### 3. XSS Sanitization
Since commenting is open to the public without auth, we must prevent script injection.
We will write a simple utility function in `src/lib/utils.ts` or in the API handler to escape HTML tags:
```typescript
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
```
Both `authorName` and `content` will be sanitized before being saved.

### 4. UI/UX Design System
The commenting UI will be appended to the bottom of the blog posts.
Features:
- **Comments Count**: Displays the total count of comments for the current post.
- **Comment Creation Form**: A text area with fields for "Name" (required) and "Email (optional, for notifications)" with a clear toggle or message.
- **Aesthetic**: Premium look with glassmorphism styling, clean inputs, and sleek dark mode compatibility.
- **Reply Action**: Clicking "Reply" on any comment toggles a specific inline reply form directly beneath that comment.
- **Micro-Animations**: Hover states, loading indicators, and success animations.

## Risks / Trade-offs

- **Concurrent Write Race Conditions**: If multiple users comment simultaneously, a slow read-write cycle could overwrite comments.
  *Mitigation*: Since this is a personal portfolio blog with low traffic, standard synchronous FS operations (`fs.readFileSync` and `fs.writeFileSync`) are fast and safe enough.
- **Spam**: Open submission allows bots to submit spam comment requests.
  *Mitigation*: For this phase, we accept this risk. In the future, we can add a lightweight spam check or a CAPTCHA.

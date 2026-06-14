## Why

Currently, our blog posts are static pages that show the article content but do not offer any interactivity for visitors to share their thoughts or engage in discussions. Adding an anonymous, lightweight comment system will encourage user engagement and allow readers to leave feedback and questions directly on individual blog posts without the barrier of having to register or log in.

## What Changes

- **Anonymous Commenting System**: Users can write a comment, leave their name, and optionally provide their email address.
- **2-Level Reply Hierarchy (Nested Comments)**: Comments will support up to two levels of nesting (Root comments and their direct replies). Any further nesting is blocked or flattened to level 2 to keep discussions clean and readable.
- **Email Notifications Placeholder**: If a user leaves their email and their comment receives a reply, they can be notified. The core routing and option in the UI will be created, but actual email dispatch functionality (like integrating with SendGrid/Nodemailer) is deferred for later implementation.
- **Local JSON-Based Storage**: Store comments in a local JSON file (`src/data/post-comments.json`) to persist comment data, aligning with how page views are currently managed.
- **Interactive UI**: A modern, styled, and responsive comment section component under each blog post with comment submission form, reply triggers, and a list of existing comments.

## Capabilities

### New Capabilities
- `post-comments`: Provides the complete backend API and front-end user interface for managing, displaying, and creating anonymous, 2-level nested comments on blog posts.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **API Route**: A new Next.js Route Handlers at `src/app/api/posts/comments/route.ts` to support `GET` and `POST` for comments.
- **Data Directory**: A new local JSON file at `src/data/post-comments.json` to store comment structures.
- **Blog Post Page**: Modify `src/app/blog/[slug]/page.tsx` or a related client component (like `BlogClient.tsx` or a new `CommentsSection.tsx` component) to display the comments and the submission form.
- **Styles/Tailwind**: Use existing CSS/Tailwind utilities to build premium, modern comment forms and cards.

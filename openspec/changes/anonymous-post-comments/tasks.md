## 1. Setup and Data Layer

- [x] 1.1 Create the comments JSON data file template at `src/data/post-comments.json`
- [x] 1.2 Implement the sanitization utility `sanitizeInput` in the project helpers or Route Handler to escape HTML characters

## 2. Backend Implementation (API)

- [x] 2.1 Create the comments Next.js Route Handler at `src/app/api/posts/comments/route.ts` with `GET` support for fetching comments by post slug
- [x] 2.2 Implement `POST` support in `src/app/api/posts/comments/route.ts` to create root comments with Name, Content, and optional Email
- [x] 2.3 Add nesting limit enforcement in the `POST` handler to ensure replies are strictly kept at level 2 (replies to level 2 comments are automatically grouped under the root comment)

## 3. Frontend Implementation (UI)

- [x] 3.1 Create a premium, glassmorphism `CommentsSection` React component with a clean and interactive nested comment list
- [x] 3.2 Build the comment and reply forms featuring modern inputs, responsive layouts, hover states, and validation warnings
- [x] 3.3 Integrate the `CommentsSection` component into the blog post details page layout

## 4. Verification and Polishing

- [x] 4.1 Perform functional checks on comment creation, retrieval, and reply nesting limits
- [x] 4.2 Validate inputs sanitization to prevent XSS script execution in name and comment body fields
- [x] 4.3 Ensure the layout and animations adapt beautifully across mobile, tablet, and desktop devices

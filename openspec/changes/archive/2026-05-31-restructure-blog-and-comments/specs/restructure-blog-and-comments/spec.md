## ADDED Requirements

### Requirement: Unified Library & Types
The system SHALL expose unified interfaces for `BlogPost` and `BlogComment` under `src/lib/blog.ts` to improve developer experience and reduce duplication.

#### Scenario: Verify interface export
- **WHEN** a developer inspects `src/lib/blog.ts`
- **THEN** it SHALL export interfaces for BlogPost and BlogComment cleanly.

### Requirement: Separated dynamic routes
The blog home page and dynamic slug page SHALL serve as lightweight Next.js Server Components, fetching raw Markdown data and comments from API routes/data directories, and passing props down to interactive Client Components.

#### Scenario: Browse blog homepage
- **WHEN** a visitor navigates to `/blog`
- **THEN** it SHALL render instantly, delegating client-side filters and searching state cleanly to `<BlogList>`.

#### Scenario: Read dynamic blog post
- **WHEN** a visitor navigates to `/blog/[slug]`
- **THEN** the server page SHALL retrieve metadata and trigger view increment, then delegate TOC sidebar navigation, custom MDX styling, related suggestions, next/prev paginations, and the Comments section directly to `<BlogPostDetail>`.

### Requirement: Modular comments timeline
The old monolithic `CommentsSection.tsx` component SHALL be refactored into a highly modular layout using gentle, soft colors and direct native strings (no i18n JSON translation keys).

#### Scenario: Post reply in comment timeline
- **WHEN** a reader enters author name, optional email, and message and posts a nested comment
- **THEN** the react component SHALL safely update comment states client-side without full page refreshes.

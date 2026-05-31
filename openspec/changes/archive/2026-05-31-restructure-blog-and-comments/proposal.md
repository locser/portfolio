## Why

To enhance codebase maintainability and align the Blog system with the newly established `.cursorrules` (clean layout, pastel color themes, direct native text strings), we need to split the blog list and blog detail page from monolithic server renderers into clean, separated API-frontend layers. This mirrors the high-quality architecture utilized in the community forums feature.

## What Changes

- **Separate Core Library and Types (`src/lib/blog.ts`)**: Define BlogPost and BlogComment interfaces and safe wrapper files.
- **Client Components (`src/components/blog/`)**: 
  - `BlogList.tsx`: Handles search, tags filtering, and layout rendering.
  - `BlogPostDetail.tsx`: Handles TOC parsing, MDX render components, suggestions, and next/prev paginations.
  - `CommentsSection.tsx`: Modular comments timeline and Level 2 nesting reply forms.
- **Lite Route Loaders (`src/app/blog/`)**: 
  - `src/app/blog/page.tsx`: Lightweight RSC loader.
  - `src/app/blog/[slug]/page.tsx`: Dynamic dynamic route loader with server-side view increments.

## Capabilities

### New Capabilities
- `restructure-blog-and-comments`: Separation of API and representation layer for both blog pages and comment section timelines.

### Modified Capabilities

## Impact

- **Affected files**:
  - `src/app/blog/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/components/CommentsSection.tsx`
  - `src/lib/blog.ts` (new)
  - `src/components/blog/BlogList.tsx` (new)
  - `src/components/blog/BlogPostDetail.tsx` (new)
  - `src/components/blog/CommentsSection.tsx` (new)

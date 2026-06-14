## Context

To enhance codebase modularity and adhere to `.cursorrules` guidelines, we are restructuring the Blog section and Comments timeline to split representation concerns from Server Loader pages.

## Goals / Non-Goals

**Goals:**
- Decouple monolithic page layouts into small, modular React components.
- Align design style to monochromatic minimalist layout using soft pastel/gentle light-dark themes.
- Guarantee that all UI elements use native Vietnamese strings directly in the components rather than i18n translation variables.

**Non-Goals:**
- Restructuring the API endpoints or the Markdown file parser logic (`getAllPosts`, `getPostBySlug`). Those remain functional; we are only updating their consumption pages.

## Decisions

### Decision 1: Create `src/lib/blog.ts`
- **Rationale**: Keeps model types unified in one file, facilitating import checks.

### Decision 2: Split dynamic page.tsx
- **Rationale**: Isolates rendering code into a `<BlogPostDetail>` client component, allowing table of contents, MDX remote rendering, related posts suggestions, and next/prev paginations to react snappily.

### Decision 3: Modularize CommentsSection
- **Rationale**: Moves `CommentsSection.tsx` under `src/components/blog/CommentsSection.tsx` and cleans up its monolithic structure.

## Risks / Trade-offs

- **[Risk]** Breaking MDX styles.
  - **Mitigation**: Keep components schema mapping identical so that heading formatting and syntax highlighting are preserved without regression.

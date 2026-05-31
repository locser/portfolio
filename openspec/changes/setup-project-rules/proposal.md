## Why

In modern AI-assisted web development, defining clear, codebase-specific boundaries and coding guidelines is crucial for ensuring the AI agent (Antigravity) and the OpenSpec workflow produce high-quality, aligned implementations. 
Without explicit instructions, AI assistants might default to generic configurations, overly complex animation frameworks, or unnecessary internationalization boilerplate. By defining clear rules early, we align all subsequent feature changes to a unified, simple, and clean aesthetic with direct native text.

## What Changes

- **Configure Project-Level Rules (`openspec/config.yaml`)**:
  - Update `openspec/config.yaml` to specify the project's technological constraints: Next.js 14 App Router, standard Tailwind CSS, no i18n, simple design approach, and soft color palettes.
- **Create AI Agent Rules (`.cursorrules`)**:
  - Add a `.cursorrules` file at the root of the workspace that dictates specific coding rules for Antigravity, including:
    - Preferring standard React Server Components.
    - Zero i18n/localization requirements (direct simple text).
    - Designing a simple, minimalist, and gentle aesthetic using pastel and soft, calm colors (Tailwind HSL/standard colors).
    - Preventing excessive, distracting 3D animations or flashiness (only subtle, natural micro-animations).
- **Refactor `project.rules.md`**:
  - Align `project.rules.md` to match the minimalist, gentle aesthetic and remove any legacy multilingual (English/French) references.

## Capabilities

### New Capabilities
- `project-rules-setup`: Introduces the project-level development rules defining a simple layout, soft color aesthetic, and removing localization requirements.

### Modified Capabilities
<!-- No requirement changes in existing capabilities since there are no previous specs. -->

## Impact

- **Affected files**:
  - `openspec/config.yaml` (updated with custom context & rules)
  - `project.rules.md` (refactored to focus on minimalist design and direct language)
  - `.cursorrules` (new file specifying AI instructions)
- **Dependencies**: No external dependencies are added or removed.

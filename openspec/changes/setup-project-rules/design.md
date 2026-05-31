## Context

Currently, the workspace has a legacy setup that includes multilingual (English/French) translations inside `src/locales`, HSL CSS variables configured for intense dark mode styles, and references to complex interactive features in `project.rules.md`. 
To shift toward a clean, simple developer portfolio with gentle colors and direct, non-i18n text implementation, we need a technical design that informs both the OpenSpec CLI and the AI agent (Antigravity) of these updated constraints.

## Goals / Non-Goals

**Goals:**
- Update `openspec/config.yaml` to specify project constraints (Next.js 14, Tailwind CSS, no i18n, simple layout, gentle colors).
- Create a root `.cursorrules` file detailing absolute rules for Antigravity: no i18n, simple UI, soft colors, and only subtle transitions.
- Refactor `project.rules.md` to remove translation references and update the design direction to minimalist & soft pastel colors.

**Non-Goals:**
- Deleting the `src/locales` directory or rewriting all existing codebase components to remove legacy translation imports. Legacy files will be touched or migrated only when modified in future changes. This change focuses purely on setting up rules.

## Decisions

### Decision 1: Root `.cursorrules` for direct AI constraints
- **Option A**: Write rules only in `project.rules.md`.
- **Option B (Chosen)**: Create a root-level `.cursorrules` file alongside updating `project.rules.md`.
- **Rationale**: Modern AI coding tools (including Antigravity and Cursor) automatically read `.cursorrules` as a system prompt. It guarantees that the AI assistant strictly follows coding standards (e.g. Next.js 14 App Router, no i18n, gentle colors, standard Tailwind) during code generation.

### Decision 2: Update `openspec/config.yaml`
- **Option A**: Leave it default.
- **Option B (Chosen)**: Populate `context` and `rules` in `openspec/config.yaml`.
- **Rationale**: The OpenSpec CLI references `config.yaml` to generate instructions for proposals, designs, and tasks. Ensuring it contains our minimalist design and direct text requirements ensures all future changes are generated with these principles in mind.

### Decision 3: Keep existing `src/locales` folder intact for now
- **Option A**: Delete `src/locales` and refactor all existing components using translations.
- **Option B (Chosen)**: Keep the `src/locales` directory for backward compatibility but state in the rules that new code must not use it.
- **Rationale**: Completely refactoring the current app to remove legacy translations is out-of-scope for a rule setup change and could break existing page components. It is safer to deprecate the i18n practice for future changes.

## Risks / Trade-offs

- **[Risk]** AI might still read existing translation files and attempt to use them.
  - **Mitigation**: The `.cursorrules` and `openspec/config.yaml` files explicitly state: `"You are strictly forbidden from writing translations to json or using i18next. All new features and UI copies must be written as direct native text strings."`
- **[Risk]** Gentle colors could clash with the legacy dark mode colors defined in `globals.css`.
  - **Mitigation**: Our rules specify that the design should transition to soft, minimalist tones. Future styling changes will refactor `globals.css` base classes as needed.

## ADDED Requirements

### Requirement: System constraints and OpenSpec configuration
The repository's `openspec/config.yaml` SHALL be updated to establish project-wide constraints and per-artifact validation rules that specify a simple design philosophy and the total removal of internationalization (i18n) requirements.

#### Scenario: Configure OpenSpec context and rules
- **WHEN** the OpenSpec CLI is executed or an artifact is created
- **THEN** the configurations in `openspec/config.yaml` SHALL verify that the project context specifies Next.js 14 App Router, standard Tailwind CSS, no i18n, simple design layouts, and soft colors.

### Requirement: AI Agent configuration (.cursorrules)
A `.cursorrules` file SHALL be created at the root of the workspace to enforce coding and design constraints directly on AI assistants like Antigravity.

#### Scenario: Write AI coding instruction rules
- **WHEN** an AI assistant (such as Antigravity) is triggered to read workspace rules
- **THEN** it SHALL strictly follow guidelines for Next.js 14 App Router, direct native text string implementation (no i18n libraries), soft pastel/light styling, and subtle micro-animations instead of complex animations.

### Requirement: Legacy Requirements clean-up
The legacy `project.rules.md` at the root of the workspace SHALL be refactored to align with the minimalist aesthetic and to completely remove any multilingual (English/French) requirements or i18n guidelines.

#### Scenario: Refactor project.rules.md
- **WHEN** a developer inspects the root `project.rules.md` file
- **THEN** they SHALL see updated portfolio section guidelines that reflect a simple layout and soft color aesthetics without any translation keys or multi-language configurations.

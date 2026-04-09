# AGENTS Guide for `blog`

## 1) Repository Snapshot
- Stack: VitePress `^1.6.3`, Vue 3 SFCs, mixed JS/TS in theme code.
- Package manager: npm (`package-lock.json` present).
- CI Node version: Node `20` (`.github/workflows/deploy.yml`).
- Main content root: `docs/src/**/*.md`.
- Theme and custom logic: `docs/.vitepress/**`.
- Build output: `docs/.vitepress/dist`.
- Deployment: GitHub Pages workflow + `vercel.json`.

## 2) Build / Lint / Test Commands

### Install
- `npm ci` (preferred for reproducible installs and CI parity).
- `npm install` (acceptable for local dependency changes).

### Build and Run
- `npm run dev` -> start local VitePress dev server.
- `npm run docs:build` -> production build (required validation step).
- `npm run docs:preview` -> preview the built site.
- `npm run deploy:win` -> runs `powershell bin/autoDeploy.bat`.

### Lint Status (Current State)
- No lint script exists in `package.json`.
- Do not claim lint passed unless lint tooling is added.

### Test Status (Current State)
- No test runner config (Vitest/Jest) is present.
- `npm test` is a placeholder and intentionally fails.
- There is currently no real "single test" command in this repo.

### Single-Test Guidance (If Tests Are Added Later)
- Preferred Vitest one-file run: `npx vitest run path/to/file.test.ts`.
- Preferred single-case run: `npx vitest run path/to/file.test.ts -t "case name"`.
- If scripts are added, prefer npm scripts over raw `npx`.
- Suggested script set when enabling tests:
- `"test": "vitest"`
- `"test:run": "vitest run"`
- `"test:single": "vitest run"`

### Command Intent Reference
- Install deps reproducibly: `npm ci`.
- Start authoring docs locally: `npm run dev`.
- Produce deployable artifacts: `npm run docs:build`.
- Smoke-check built output: `npm run docs:preview`.
- Run placeholder test command: `npm test` (expected to fail in current repo state).

### Single-Test Expectations for Agents
- If user asks to run one test now, explain there is no configured test runner yet.
- Do not fabricate passing test output when only placeholder scripts exist.
- If tests are introduced later, prefer one-file run before full-suite run.
- When test tooling is added, document exact command used in final report.
- If a PR includes test-related changes, state whether tests were runnable or not.

## 3) Required Validation Before Marking Work Done
- Minimum required check for code/content edits: `npm run docs:build`.
- For UI/theme changes, also run `npm run dev` and click through affected pages.
- If deployment/build config changed, confirm `docs/.vitepress/dist` is produced.
- Do not claim "tests passed" until a real test suite exists and has run.

## 4) Cursor and Copilot Rules Detection
- `.cursorrules`: not found.
- `.cursor/rules/`: not found.
- `.github/copilot-instructions.md`: not found.
- No additional agent policy files are currently detected.

## 5) Directory Map for Fast Navigation
- `docs/.vitepress/config.mjs`: site config, nav/sidebar/search/markdown setup.
- `docs/.vitepress/theme/index.js`: theme extension and global component wiring.
- `docs/.vitepress/theme/components/*.vue`: nav card and related theme components.
- `docs/.vitepress/components/*.vue`: reusable page-level components.
- `docs/.vitepress/theme/styles/*.{css,scss}`: theme style overrides.
- `docs/src/**/*.md`: article content and frontmatter.

## 6) Code Style and Conventions

### General Editing Rules
- Keep edits minimal, scoped, and request-driven.
- Preserve existing architecture and file placement.
- Avoid broad refactors unless explicitly requested.
- Do not reformat entire files when touching small sections.

### Imports
- Default import order: third-party -> framework (`vue`/`vitepress`) -> local.
- Keep one import per line unless local file style already groups imports.
- Use `import type` for type-only imports in TS and Vue TS blocks.
- Keep local import paths consistent with nearby files.

### Formatting
- This repo is style-mixed (semicolons and quotes vary by file).
- Follow the dominant style of the file being edited.
- Preserve existing indentation and spacing conventions in that file.
- Keep multiline objects/arrays readable and trailing commas consistent.

### TypeScript and Types
- Prefer TypeScript for logic-heavy new code in theme/components.
- Reuse existing types and patterns (for example `NavLink`-style definitions).
- Avoid `any`; when unavoidable, minimize scope and document intent briefly.
- Prefer nullable guards and safe defaults over non-null assertions.
- In Vue SFCs, prefer typed `defineProps<...>()`.

### Vue Component Patterns
- Preferred section order: `<script setup>` -> `<template>` -> `<style scoped>`.
- Use PascalCase for new shared component filenames.
- Existing lowercase component filenames may remain as-is; avoid churn renames.
- Prefer reactive APIs (`ref`, `computed`, watchers) over direct DOM mutation.
- If DOM access is necessary, add null guards and browser-only safety checks.
- Register global components only in `docs/.vitepress/theme/index.js`.

### Naming Conventions
- Variables and functions: `camelCase`.
- Types, interfaces, and component names: `PascalCase`.
- Exported constants: `UPPER_SNAKE_CASE` when they are immutable datasets.
- Keep existing path names stable, including historical names like `untils`.
- Do not mass-rename symbols or paths unless explicitly requested.

### Error Handling and Runtime Safety
- Guard browser-specific logic (`inBrowser`, lifecycle hooks, optional chaining).
- Avoid throwing hard errors in rendering paths; fail soft where possible.
- Use fallback values for optional API/DOM results.
- Clean up listeners/timers in unmount hooks when added.

### CSS / SCSS
- Prefer VitePress CSS variables (`--vp-*`) before hardcoded theme colors.
- Prefer scoped styles in SFC components unless a global override is required.
- Preserve responsive behavior with explicit media queries when needed.
- Keep style changes local to affected components/pages.

### Markdown Content
- Keep article files under `docs/src/` with stable routes.
- Preserve heading hierarchy for outline/search behavior.
- Verify moved/renamed pages against configured nav/sidebar links.

## 7) Config-Specific Cautions
- `docs/.vitepress/config.mjs` is large and manually curated.
- Make surgical edits to avoid accidental ordering/whitespace churn.
- Any `base`, nav, or sidebar path change must be checked against real files.
- Be careful with multilingual paths and encoded links.

## 8) Git and PR Hygiene for Agents
- Never revert unrelated local working tree changes.
- Stage only files that are relevant to the requested task.
- In PR/commit notes, explicitly mention missing lint/test infrastructure when true.
- Include verification evidence, at least `npm run docs:build` output status.

## 9) Quick Execution Playbook
- 1. Read target files and nearby patterns before editing.
- 2. Apply the smallest change that satisfies the request.
- 3. Run `npm run docs:build`.
- 4. For UI edits, run `npm run dev` and smoke-test affected pages.
- 5. Report changed files and exact verification commands you ran.

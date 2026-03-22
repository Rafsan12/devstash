# DevStash

A developer-focused knowledge hub for snippets, commands, prompts, notes, files, images, links, and custom content types.

---

## Context Files

Before making architectural or feature changes, read:

- ./context/project-overview.md

Use this as the source of truth for:

- product goals
- feature design
- system behavior

---

## Tech Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Future: Prisma + PostgreSQL

---

## Project Structure & Module Organization

- App code lives in `src/app`
- Root layout: `layout.tsx`
- Routes: `page.tsx`, `loading.tsx`, etc.
- Global styles: `globals.css`
- Static assets: `public/`
- Use `@/*` alias for imports from `src/`

Do NOT edit:

- `.next/`
- `node_modules/`

---

## Architecture Guidelines

- Keep UI logic inside components in `src/app`
- Extract reusable logic into separate modules when needed
- Avoid large, complex components
- Prefer simple and readable structure over premature abstraction
- Keep components modular and composable

---

## Feature Rules

### Notes System

- Notes behave like files (similar to `.md`)
- Store content in a structured format (markdown-ready)
- Must support future markdown/MDX rendering

### Collections

- Used to group notes logically (e.g. React patterns, prompts)
- Should be flexible and extendable

### Search (future)

- Must be fast and scalable
- Design with indexing in mind

---

## Coding Style & Naming Conventions

- Use TypeScript with strict assumptions
- Use 2-space indentation and double quotes
- Prefer functional React components
- Use PascalCase for components
- Use camelCase for variables and functions
- Keep code readable and explicit

---

## Behavior Rules (Critical)

- Always read relevant files before making changes
- Prefer minimal, targeted changes (avoid large rewrites)
- Do not modify unrelated files
- Explain planned changes before applying them
- Ask for approval before multi-file or risky changes

---

## Safety Rules

- Do not delete files unless explicitly instructed
- Do not modify `.env` files
- Do not install new dependencies without approval
- Do not change project structure without explanation

---

## Output Rules

- Show diffs before applying changes when possible
- Clearly explain what was changed and why
- Keep responses concise and implementation-focused

---

## Build, Test, and Development Commands

- `npm run dev` → start dev server
- `npm run build` → production build
- `npm run start` → run production build
- `npm run lint` → run ESLint

Always run commands from the project root.

---

## Testing Guidelines

- No test runner configured yet
- Minimum validation:
  - `npm run lint`
  - `npm run build`
- Future tests:
  - use `.test.ts` / `.test.tsx`

---

## Commit & Pull Request Guidelines

- Use short, imperative commit messages  
  Example: `Add dashboard layout`

- Keep commits focused and small

PRs should include:

- clear description
- related issue/task (if available)
- screenshots (for UI changes)
- confirmation that lint + build passed

---

## Agent-Specific Notes

- Do not edit generated files
- Prefer small, safe, incremental changes
- Maintain consistency with existing structure
- Prioritize clarity over cleverness

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Is DevStash

A developer-focused knowledge workspace for storing snippets, commands, prompts, notes, and links. Items behave like typed files (`.md`, `.ts`, `.prompt`) organized into Collections, stored in a PostgreSQL database.

Before making architectural or feature changes, read `./context/project-overview.md` as the source of truth for product goals, feature design, and system behavior.

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run lint          # Run ESLint
npm run test          # Run Vitest (single run)
npm run test:watch    # Run Vitest in watch mode
npm run db:migrate    # Apply Prisma migrations
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:seed       # Seed the database
npm run db:format     # Format Prisma schema files
```

Always run `npm run test && npm run lint && npm run build` before committing.

## Architecture

### Data Model

```
User
├── Collections (logical groupings)
└── Items (content with a type: markdown, code, prompt, text, link)
    └── ItemType (system-defined: icon, color, fileExtension)
RecentItem  (tracks per-user recently visited items)
```

The Prisma schema is split into modular files under `prisma/schema/`.

### Request Flow

- **Server components** fetch data directly via Prisma (`src/lib/db/`)
- **Mutations** go through Server Actions (`src/actions/`) — validated with Zod, return `{ success, data, error }`
- **API routes** (`src/app/api/`) handle auth flows, webhooks, and operations needing specific HTTP semantics (item GET/PATCH/DELETE, auth registration, password reset)
- **Auth** is NextAuth.js v5 (JWT strategy) with a Prisma adapter; email/password + optional GitHub OAuth

### Key Directories

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router pages and API routes |
| `src/components/dashboard/` | Main app UI (shell, item/collection cards, drawer, modals) |
| `src/components/auth/` | Auth forms and shell |
| `src/components/ui/` | shadcn/ui primitives |
| `src/actions/` | Server Actions (Zod-validated mutations) |
| `src/lib/db/` | Prisma query functions |
| `src/lib/auth/` | NextAuth config and helpers |
| `context/` | Project documentation and feature planning |

### Item Drawer Pattern

The `ItemDrawer` (`src/components/dashboard/item-drawer.tsx`) is managed by `ItemDrawerProvider` (context). Components open it by calling context methods — not by managing drawer state locally.

## Coding Standards

### TypeScript / React

- Strict mode; no `any` — use `unknown` or proper types
- Functional components only; server components by default
- Add `'use client'` only when needed (hooks, browser APIs, interactivity)
- One job per component; extract reusable logic to custom hooks

### Tailwind CSS v4 — Critical

**Do NOT create `tailwind.config.ts/.js`** — those are v3 config files. All theme customization goes in `src/app/globals.css` using the `@theme` directive:

```css
@import "tailwindcss";
@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

### Database

- All schema changes via `prisma migrate dev` (never `db push` in development)
- Run `prisma migrate status` before committing to verify migrations are in sync
- Production must run `prisma migrate deploy` before the app starts

### Testing

- **Vitest, node environment** — server actions and utilities only
- Do NOT write tests for React components
- Test files are `*.test.ts` co-located next to the source file

### Naming

- Components: `PascalCase` (`ItemCard.tsx`)
- Files: match component name or `kebab-case`
- Functions/variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

## Environment Variables

See `.env.example`. Key vars:

```
DATABASE_URL                  # Neon PostgreSQL connection string
APP_URL                       # e.g. http://localhost:3000
NEXTAUTH_SECRET
EMAIL_VERIFICATION_ENABLED    # "true" / "false"
RESEND_API_KEY
RESEND_FROM_EMAIL
```

## Safety Rules

- Do not delete files unless explicitly instructed
- Do not modify `.env` files
- Do not install new dependencies without approval
- Prefer minimal, targeted changes — avoid large rewrites
- Ask for approval before multi-file or risky changes

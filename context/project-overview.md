# 🗃️ DevStash — Project Overview

> **A developer-first knowledge workspace.**
> Think of it as Notion + filesystem + a markdown IDE — where every note is a searchable, organized knowledge file.

---

## 1. Vision

DevStash is a minimal, keyboard-driven knowledge workspace built _for developers, by developers_. Notes behave like files (`.md`, `.ts`, etc.) but are organized like a structured database — fast to write, easy to search, pleasant to use.

**Design pillars:**

- ⚡ Speed-first
- 🖤 Minimal dark UI
- ⌨️ Keyboard-driven workflow
- 🗂️ File-like note structure

---

## 2. Target Users

| Audience                          | Use Cases                                                                 |
| --------------------------------- | ------------------------------------------------------------------------- |
| **Developers** (primary)          | Code snippets, architecture notes, AI prompts, debug logs, learning notes |
| **Knowledge workers** (secondary) | Structured notes, searchable reference material, distraction-free writing |

---

## 3. Core Entities

```
DevStash
├── User          → Authenticated account
├── Collection    → Logical grouping (like a smart folder)
└── Item          → A single note/file
    └── ItemType  → Defines behavior (markdown, code, prompt, text)
```

### Item Types

| Type       | Extension     | Description          |
| ---------- | ------------- | -------------------- |
| `markdown` | `.md`         | Documentation, notes |
| `code`     | `.ts` / `.js` | Snippets & scripts   |
| `prompt`   | `.prompt`     | AI prompt storage    |
| `text`     | `.txt`        | Plain text           |

_Future: `.json`, `.yaml`, `.pdf`, images, attachments_

---

## 4. Data Architecture

### Screenshots

Refer to the screenshots below as a base for the dashboard UI. It does not have to be exact,Use it as a reference:

- @context/screenshots/dashboard-ui-main.png
- @context/screenshots/dashboard-ui-drawer.png

### Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String       @id @default(cuid())
  email       String       @unique
  password    String
  createdAt   DateTime     @default(now())

  collections Collection[]
  items       Item[]
  recentItems RecentItem[]
}

model Collection {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  items       Item[]
}

model Item {
  id            String   @id @default(cuid())
  title         String
  content       String   @db.Text
  type          ItemType
  fileExtension String
  collectionId  String
  userId        String
  isPinned      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  collection    Collection   @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  user          User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  recentItems   RecentItem[]
}

model RecentItem {
  id        String   @id @default(cuid())
  userId    String
  itemId    String
  visitedAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([userId, itemId])
}

enum ItemType {
  markdown
  code
  prompt
  text
}
```

---

## 5. Feature List

### MVP (v1)

| Feature                 | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| 🔐 **Authentication**   | Email/password login, session management, protected routes |
| 📁 **Collections**      | Create & manage named collections (smart folders)          |
| 📝 **Items**            | Create/edit/delete notes with file types                   |
| ✍️ **Markdown Editor**  | Rich editor (TipTap or CodeMirror)                         |
| 🔍 **Search**           | Global full-text search across title, content, tags        |
| 📌 **Pin Notes**        | Pin important items to sidebar                             |
| 🕐 **Recently Visited** | Track and display last-opened items                        |
| 🌑 **Dark Mode**        | Default dark theme                                         |

### Post-MVP

| Feature         | Description                                            |
| --------------- | ------------------------------------------------------ |
| 📎 File uploads | Images, PDFs, attachments (S3 / R2 / Supabase Storage) |
| 🤖 AI features  | Summarize notes, generate docs, semantic search        |
| 🕸️ Graph view   | Obsidian-style note relationship graph                 |
| 🏷️ Tags         | `#react` `#security` `#prompt` tagging system          |
| 🔗 Wiki links   | `[[JWT Security]]`-style note linking                  |

---

## 6. UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Sidebar            │  Content (Editor)       │  Inspector       │
│─────────────────────│─────────────────────────│──────────────────│
│  🔍 Search          │                         │  Title           │
│                     │  # React.memo           │  Type: markdown  │
│  📌 Pinned          │                         │  Collection:     │
│   ├ system-design   │  Used to prevent        │  React Patterns  │
│   └ prompt-framework│  unnecessary re-renders │                  │
│                     │  ...                    │  Created: today  │
│  🕐 Recent          │                         │  Updated: today  │
│   ├ jwt-security.md │                         │                  │
│   └ react-hooks.md  │                         │  [Pin]  [Delete] │
│                     │                         │                  │
│  📁 Collections     │                         │                  │
│   ├ React Patterns  │                         │                  │
│   ├ Prompt Library  │                         │                  │
│   └ Backend Tricks  │                         │                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Tech Stack

| Layer          | Choice                                                                       | Notes                          |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| **Framework**  | [Next.js](https://nextjs.org/) (App Router)                                  | Full-stack, file-based routing |
| **Language**   | TypeScript                                                                   | Type safety throughout         |
| **Styling**    | [Tailwind CSS](https://tailwindcss.com/)                                     | Utility-first                  |
| **Components** | [shadcn/ui](https://ui.shadcn.com/)                                          | Accessible, composable         |
| **Database**   | [PostgreSQL](https://www.postgresql.org/)                                    | Relational, full-text search   |
| **ORM**        | [Prisma](https://www.prisma.io/)                                             | Type-safe DB client            |
| **Auth**       | [NextAuth.js](https://next-auth.js.org/) or [Lucia](https://lucia-auth.com/) | Session management             |
| **Editor**     | [TipTap](https://tiptap.dev/) or [CodeMirror](https://codemirror.net/)       | Rich / code-aware editing      |
| **Search**     | PostgreSQL FTS → [Meilisearch](https://www.meilisearch.com/)                 | Start simple, scale later      |
| **Hosting**    | [Vercel](https://vercel.com/)                                                | Edge-optimized Next.js         |
| **DB Hosting** | [Supabase](https://supabase.com/)                                            | Managed Postgres               |

---

## 8. Folder Structure

```
devstash/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── dashboard/
│   │   ├── collections/
│   │   ├── items/
│   │   └── search/
│   └── api/
│       ├── auth/
│       ├── items/
│       └── collections/
├── components/
│   ├── sidebar/
│   ├── editor/
│   ├── search/
│   ├── item-list/
│   └── collection-list/
├── lib/
│   ├── db.ts         # Prisma client
│   ├── auth.ts       # Auth helpers
│   └── search.ts     # Search utilities
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

---

## 9. API Design

```
POST   /api/items          → Create item
GET    /api/items          → List all items
GET    /api/items/:id      → Get single item
PUT    /api/items/:id      → Update item
DELETE /api/items/:id      → Delete item

POST   /api/collections          → Create collection
GET    /api/collections          → List collections
GET    /api/collections/:id      → Get collection with items
PUT    /api/collections/:id      → Update collection
DELETE /api/collections/:id      → Delete collection

GET    /api/search?q=jwt         → Full-text search across items

POST   /api/recent/:itemId       → Record item visit
GET    /api/recent               → Get recently visited items
```

---

## 10. Storage Strategy

### Phase 1 — Simple (MVP)

Store content directly in PostgreSQL as `TEXT`. Fast to build, no extra infrastructure.

### Phase 2 — Scalable

Store large files in object storage; DB holds reference only.

| Option                                                       | Notes                          |
| ------------------------------------------------------------ | ------------------------------ |
| [AWS S3](https://aws.amazon.com/s3/)                         | Most established               |
| [Cloudflare R2](https://developers.cloudflare.com/r2/)       | No egress fees, S3-compatible  |
| [Supabase Storage](https://supabase.com/docs/guides/storage) | Easiest if already on Supabase |

```
// Phase 2 item fields
file_url      String?
file_type     String?
content       String?   @db.Text  // kept for small/inline items
```

---

## 11. Editor Options

### Option A — TipTap _(Recommended for v1)_

- ✅ Modern, highly extensible
- ✅ Markdown support out of the box
- ✅ Great ecosystem of extensions
- ✅ Feels like a polished product editor

### Option B — CodeMirror _(Better for dev-heavy use)_

- ✅ Syntax highlighting for `.ts`, `.js`, `.json`, `.yaml`
- ✅ Feels like a mini IDE
- ✅ Great for code snippet storage
- ⚠️ Less rich for prose/markdown

> **Recommendation:** Start with TipTap for MVP. Add CodeMirror as an alternate view for `code` item types.

---

## 12. Engineering Challenges

These are the areas most likely to cause problems — address them early.

| Challenge                  | Risk                                          | Mitigation                                                    |
| -------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| **Search scaling**         | Slow FTS on large datasets                    | Start with PG FTS, migrate to Meilisearch at scale            |
| **Editor complexity**      | Rich editors have subtle bugs                 | Pick one editor and go deep, don't mix                        |
| **Note relationships**     | `[[wiki links]]` are non-trivial to implement | Defer to post-MVP, design schema with this in mind            |
| **Large note performance** | Big content blobs are slow to load/render     | Lazy load content, paginate list views                        |
| **Auth edge cases**        | Session expiry, concurrent logins             | Use a battle-tested lib (NextAuth/Lucia), don't roll your own |

---

## 13. Design Inspiration

| App                                    | What to take from it                  |
| -------------------------------------- | ------------------------------------- |
| [Notion](https://notion.so)            | Clean editor UX, block-based feel     |
| [Linear](https://linear.app)           | Speed, keyboard shortcuts, dark theme |
| [Raycast](https://raycast.com)         | Command palette, minimal chrome       |
| [Vercel Dashboard](https://vercel.com) | Typography, spacing, pro dark UI      |
| [Obsidian](https://obsidian.md)        | File-first thinking, graph potential  |

---

## 14. MVP Checklist

- [ ] Prisma schema + DB migrations
- [ ] NextAuth setup (email/password)
- [ ] Collection CRUD
- [ ] Item CRUD with file types
- [ ] TipTap markdown editor integration
- [ ] PostgreSQL full-text search
- [ ] Pin/unpin items
- [ ] Recently visited tracking
- [ ] Sidebar layout (search, pinned, recent, collections)
- [ ] Dark mode default theme
- [ ] Protected routes (auth middleware)
- [ ] Responsive layout

---

_DevStash — Every note is a searchable, organized knowledge file._

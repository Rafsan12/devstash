# DevStash

> **A developer-first knowledge workspace.**
> Think of it as Notion + filesystem + a markdown IDE, where every note is a searchable, organized knowledge file.

## Vision

DevStash is a minimal, keyboard-driven knowledge workspace built for developers. Notes behave like files (`.md`, `.ts`, `.prompt`) but are organized like a structured database — fast to write, easy to search, and pleasant to use.

- Speed-first
- Minimal dark UI
- Keyboard-driven workflow
- File-like note structure

---

## Current Features

- Authentication with credentials and GitHub via NextAuth
- Email verification, resend verification, forgot password, and reset password flows
- Dashboard with stats, pinned items, recent items, recent collections, and sidebar summaries
- Collections pages with create, edit, delete, and detail views
- Item creation, editing, deletion, and collection reassignment
- Markdown editor (react-markdown) and Monaco code editor for supported item types
- Global search / command palette with `Cmd+K` / `Ctrl+K`
- Rate limiting via Upstash Redis
- Profile page and settings page for account actions

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) in strict mode |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Auth | [NextAuth.js v5](https://next-auth.js.org/) |
| Code Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Rate Limiting | [Upstash Redis](https://upstash.com/) |
| Testing | [Vitest](https://vitest.dev/) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rafsan12/devstash.git
   cd devstash
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` from `.env.example` and fill in the required values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/devstash"
   APP_URL="http://localhost:3000"
   EMAIL_VERIFICATION_ENABLED="true"
   RESEND_API_KEY="re_xxxxxxxxx"
   RESEND_FROM_EMAIL="DevStash <onboarding@resend.dev>"
   AUTH_SECRET=""
   AUTH_GITHUB_ID=""
   AUTH_GITHUB_SECRET=""
   UPSTASH_REDIS_REST_URL=""
   UPSTASH_REDIS_REST_TOKEN=""
   ```

4. Run database generation and migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Seed the database if you want demo data:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Run Prisma development migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:format` | Format the Prisma schema |

---

## Data Model

```
User
├── Collections   (logical groupings)
└── Items         (content with a type: markdown, code, prompt, text)
    └── ItemType  (system-defined: icon, color, fileExtension)
RecentItem        (tracks per-user recently visited items)
```

---

## Roadmap

- [ ] Tags (`#react`, `#security`, `#prompt`)
- [ ] PostgreSQL full-text search
- [ ] Wiki-style note linking (`[[JWT Security]]`)
- [ ] File attachments (images, PDFs)
- [ ] AI-powered summarization and semantic search
- [ ] Graph view for note relationships

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request if you'd like to improve DevStash.

For project context and implementation guidance, refer to:

- [context/project-overview.md](context/project-overview.md)
- [AGENTS.md](AGENTS.md)

---

DevStash: Every note is a searchable, organized knowledge file.

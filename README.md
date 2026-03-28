# 🗃️ DevStash

> **A developer-first knowledge workspace.**  
> Think of it as Notion + filesystem + a markdown IDE — where every note is a searchable, organized knowledge file.

## 🌟 Vision

DevStash is a minimal, keyboard-driven knowledge workspace built *for developers, by developers*. Notes behave like files (`.md`, `.ts`, etc.) but are organized like a structured database — fast to write, easy to search, pleasant to use.

- ⚡ **Speed-first**
- 🖤 **Minimal dark UI**
- ⌨️ **Keyboard-driven workflow**
- 🗂️ **File-like note structure**

---

## 🚀 Features

- **Authentication**: Secure email/password login and session management.
- **Collections**: Group notes logically in smart folders.
- **Items**: Create notes with specific file types (Markdown, Code, Prompts, Text).
- **Markdown Editor**: Rich editor integration for seamless documentation.
- **Search**: Fast global search across titles, content, and tags.
- **Organization**: Pin important notes and track recently visited items.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)

---

## 💻 Getting Started

### Prerequisites

Make sure you have Node.js and npm installed. You'll also need a running PostgreSQL database.

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

3. Set up environment variables:
   Create a `.env` file in the root directory and add your database and authentication configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/devstash"
   # Add other required environment variables (e.g., authentication secrets)
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📦 Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the application for production
- `npm run start` — Start the production build
- `npm run lint` — Run ESLint to catch issues

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve DevStash. Ensure you follow the project's coding style and architecture guidelines (refer to `/context/project-overview.md` and `AGENTS.md` for details).

---

*DevStash — Every note is a searchable, organized knowledge file.*

# Current Feature

## Status

—

## Goals

## Notes

## History

<!-- Keep this updated. Earliest to latest -->

- Items List View completed
- Initial Next.js app setup from Create Next App
- Initial Next.js setup and Tailwind setup committed in `8e45554`
- Project setup and boilerplate cleanup
- Dashboard UI Phase 1 started
- Dashboard UI Phase 1 completed
- Dashboard UI Phase 2 completed
- Dashboard UI Phase 3 started
- Dashboard UI Phase 3 completed
- Prisma + Neon PostgreSQL Setup started
- Seed Development Data added as the current feature
- Dashboard Collections added as the current feature
- Dashboard Collections completed
- Dashboard Items added as the current feature
- Dashboard Items completed
- Stats & Sidebar added as the current feature
- Stats & Sidebar completed
- Add Pro Badge to Sidebar added as the current feature
- Add Pro Badge to Sidebar completed
- Dark Mode Default Theme added as the current feature
- Dark Mode Default Theme completed
- Auth Credentials - Email/Password Provider added as the current feature
- Auth Credentials - Email/Password Provider completed
- Auth UI - Sign In, Register & Sign Out added as the current feature
- Auth UI - Sign In, Register & Sign Out completed
- Email Verification on Register completed
- Toggle Email Verification completed
- **Forgot Password**: Added forgot password capabilities reusing the VerificationToken model securely with a suffix to prevent cross-authentication bugs. Implemented `(auth)/forgot-password` to email tokens via Resend, and `(auth)/reset-password` to securely validate and set new passwords.
- Profile Page added as the current feature
- Profile Page completed
- Rate Limiting for Auth completed: added Upstash-backed auth rate limiting across credentials sign-in, register, forgot-password, register, and resend-verification flows, with shared `429` handling, frontend toasts, and fail-open safety when trusted IP headers are unavailable.
- Item Drawer completed
- Item Drawer Edit Mode completed: Implemented a new server action `updateItem` with Zod validation and updated the UI in `item-drawer.tsx` to support inline editing of Title, Content, and File Extension. Unit tests added for both the DB layer and server actions.
- **Delete Item Functionality**: Implemented secure item deletion with a Shadcn UI `AlertDialog` for confirmation and `sonner` toasts for success/error feedback. Refactored the dashboard to use a new `deleteItem` server action while maintaining the existing API route.
- **Item Create Feature**: Implemented a dynamic "New Item" modal with Zod-validated server actions, supporting multiple item types (snippets, prompts, commands, notes, and links). Standardized the dashboard header with refined premium buttons and smooth icon animations.
- **Code Editor**: Added a shared Monaco-based editor for snippet and command items in the create modal and item drawer, including read-only and edit modes, macOS-style editor chrome, copy action, inferred language labels, and themed scrollbars. Verified with `npm.cmd run lint` and `npm.cmd run build`.
- **Markdown Editor**: Added a `MarkdownEditor` component with Write/Preview tabs for note and prompt items. Uses `react-markdown@6` with `remark-gfm` (CJS-compatible) to avoid Next.js ESM bundling issues. Matches the CodeEditor's dark chrome styling with macOS traffic lights, copy button, and fluid height capped at 400px. Integrated into `CreateItemModal` and `ItemDrawer` (both view and edit modes). Preview styled via a custom `.markdown-preview` CSS class in `globals.css` covering headings, code blocks, lists, blockquotes, links, and tables.
- **Collection Create**: Added a "New Collection" button to the top bar opening a modal with name and description fields. Backed by a Zod-validated server action (`createCollectionAction`) and `createCollection` lib/db function. User-scoped. Toast feedback on success/failure. Collections list updates on save via `router.refresh()`.
- **Collection Item Selection**: Added a collection selector dropdown to both the New Item modal and item Edit drawer. Replaced hardcoded `collections[0]?.id` default with a user-facing Select. Wired `collectionId` through `updateItemAction` and `updateItemById` so items can be moved between collections.
- **Collections Pages**: Created `/collections` page showing all collections in a grid using `CollectionCard`. Created `/collections/[id]` page showing items in a collection using `ClickableItemCard` + `ItemCard`. Linked sidebar "View all collections" to `/collections` and all collection cards to their detail routes.
- **Collection Edit & Delete**: Added edit and delete actions to collection cards (3-dots dropdown on `/collections` and dashboard, and dedicated buttons on `/collections/[id]`). Edit opens a pre-filled Dialog modal; delete shows an `AlertDialog` confirmation. On delete, items are moved to another collection before deletion so no content is lost. Favorite button is present but not yet functional.
- **Settings Page**: Created `/settings` page (protected, redirects to `/sign-in` if unauthenticated) containing the Account Actions (change password, delete account) moved from `/profile`. Added a Settings link with a gear icon to the sidebar account menu dropdown. Profile page now shows only profile info and usage stats.
- **Global Search / Command Palette**: Added a global search palette opened by Cmd+K / Ctrl+K or the dashboard search trigger. It performs client-side fuzzy search across items and collections, groups results into Items and Collections, supports keyboard navigation, opens items in the drawer, and routes to collection detail pages using preloaded search data.
- **Pagination**: Added page-based fetching and numbered pagination controls to `/items/[type]` and `/collections/[id]`, introduced shared pagination constants, and kept dashboard collection/item limits explicit.
- **Editor Preferences Settings**: Added a JSON `editorPreferences` column to `User`, migration, server action, DB helper, `EditorPreferencesContext` provider with autosave, and a settings UI section. Preferences (font size, tab size, word wrap, minimap, theme) persist in the database and are applied to the Monaco editor.
- **Favorites Page**: Added `isFavorite` to `Item` and `Collection` models with a migration. Created `/favorites` page with a compact, high-density list view (monospace, VS Code style) showing favorited items and collections in separate sections with counts. Star toggle wired in the item drawer, collection cards (three-dots menu), and collection detail actions. Sidebar "Favorites" section now filters by real `isFavorite`. Empty state included.
- **Pinned Items**: Added `toggleItemPin` server action. Replaced the API-fetch `handleTogglePin` in `ItemDrawerProvider` with the server action pattern (optimistic state, toast, `router.refresh()`). Pinned items now sort to the top of item-type and collection listings via `isPinned DESC` in the ORDER BY clauses.
- Homepage Mockup added as the current feature
- **Homepage Mockup**: Implemented standalone marketing prototype at `prototypes/homepage/` with animated chaos canvas (RAF + mouse repulsion), dashboard mockup, features grid with item type accent colors, AI section with code editor mockup, pricing section with yearly toggle, scroll fade-ins, fixed navbar with scroll opacity, and full mobile responsiveness.
- Homepage added as the current feature — spec written at `context/features/homepage-spec.md`, implementation in progress
- **Homepage**: Implemented full marketing homepage at `src/app/page.tsx` with 8 components under `src/components/homepage/`. Includes animated chaos canvas (rAF + mouse repulsion), 3D glass showcase card (lerp tilt + parallax layers), hero section with centered text + staggered entrance animations, features grid (6 cards with item-type accent colors), 3-step workflow section, AI section with editor mockup, CTA section, and footer. Removed File and Image item types from dashboard sidebar (filtered at DB query level).

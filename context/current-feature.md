# Current Feature

## Status
Not Started

## Goals
- [ ] 

## Notes
- 

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

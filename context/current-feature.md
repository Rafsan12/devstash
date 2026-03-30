# Item Drawer

## Status
Complete

## Goals
- Use shadcn Sheet component, opens from the right
- Clicking an ItemCard opens the drawer with that item's full data
- Works on both dashboard and items list pages
- Action bar with Favorite (star), Pin, Copy, Edit (pencil), Delete (trash, right-aligned)
- Display item details only (no editor/type-specific UI yet)
- Client wrapper component to manage drawer state (pages are server components)
- Fetch full item detail on click via API route (`/api/items/[id]`)
- Query function in `lib/db/items.ts`, API route calls it with auth check
- Drawer shows skeleton/loading state while fetching
- Should feel snappy - no page navigation

## Notes
- Loaded from context/features/item-drawer-spec.md
- Reference screenshot: `context/screenshots/dashboard-ui-drawer.png`
- Card data is already fetched by server components; full content is fetched on click
- This is the item detail view - there is no separate item page

## History

<!-- Keep this updated. Earliest to latest -->

- Item Drawer completed

- Items List View added as the current feature
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
- Rate Limiting for Auth completed: added Upstash-backed auth rate limiting across credentials sign-in, register, forgot-password, reset-password, and resend-verification flows, with shared `429` handling, frontend toasts, and fail-open safety when trusted IP headers are unavailable.

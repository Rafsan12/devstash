# Current Feature: Auth UI - Sign In, Register & Sign Out

## Status

In Progress

## Goals

- Replace NextAuth default pages with custom sign-in and registration UI.
- Add a custom `/sign-in` page with email/password auth and GitHub sign-in.
- Add a custom `/register` page with client-side validation and success redirect to sign-in.
- Show the authenticated user in the sidebar with avatar, name, and sign-out access.
- Support avatar image fallback to generated initials when no profile image is available.

## Notes

- Spec source: `context/features/auth-phase-3-spec.md`
- The `/sign-in` page should include email and password inputs, a GitHub sign-in button, a link to register, and error handling.
- The `/register` page should include name, email, password, and confirm password fields, validate inputs, submit to `/api/auth/register`, and redirect to `/sign-in` on success.
- The bottom of the sidebar should show the user avatar and name, link avatar clicks to `/profile`, and expose a sign-out action from a dropdown/popover.
- If the user has a GitHub profile image, use it; otherwise generate initials from the user name.
- Create a reusable avatar component that supports both image and initials fallback behavior.

## History

<!-- Keep this updated. Earliest to latest -->

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

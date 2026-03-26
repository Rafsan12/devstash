# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals
- Set up NextAuth v5 with the Prisma adapter and GitHub OAuth.
- Use the split auth config pattern for edge compatibility.
- Add route protection for `/dashboard/*` with Next.js 16 proxy.
- Redirect unauthenticated users to the default NextAuth sign-in page.
- Extend the session type to include `user.id`.

## Notes
- Spec source: `context/features/auth-phase-1-spec.md`
- Create `src/auth.config.ts` for the edge-safe provider-only config.
- Create `src/auth.ts` for the full auth setup with Prisma adapter and JWT session strategy.
- Create `src/app/api/auth/[...nextauth]/route.ts` to export the auth handlers.
- Create `src/proxy.ts` and use a named `proxy` export for dashboard protection.
- Create `src/types/next-auth.d.ts` to extend the session type.
- Keep NextAuth's default sign-in page for now; do not add a custom `pages.signIn`.
- Use Context7 to verify the latest Auth.js / NextAuth v5 conventions before implementation.

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

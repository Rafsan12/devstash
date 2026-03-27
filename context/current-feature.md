# Current Feature: Auth Credentials - Email/Password Provider

## Status

In Progress

## Goals
- Add Credentials provider for email/password authentication with registration.
- Use `bcryptjs` for password hashing and credential validation.
- Add a registration API route at `/api/auth/register`.
- Support signing in with email/password while keeping GitHub OAuth working.

## Notes
- Spec source: `context/features/auth-phase-2-spec.md`
- Add a password field to the `User` model via migration if it is not already present.
- Update `src/auth.config.ts` with a Credentials provider placeholder using the split config pattern.
- Update `src/auth.ts` to override the Credentials provider with bcrypt-based validation.
- Create `src/app/api/auth/register/route.ts` for registration.
- Registration should accept `name`, `email`, `password`, and `confirmPassword`, validate matching passwords, check for existing users, hash the password, and return success/error responses.
- Keep the implementation aligned with the split Auth.js configuration pattern.

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

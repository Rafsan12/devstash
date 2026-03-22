# Current Feature

Stats & Sidebar

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

- Replace the remaining dashboard stats and sidebar mock data with real database-backed data
- Display system item types in the sidebar using database data instead of `@src/lib/mock-data.ts`
- Show real collection data in the sidebar while preserving the existing layout and interaction style
- Keep the implementation modular by extending the database-backed dashboard helpers
- Add the remaining sidebar navigation needed for collections browsing

## Requirements

### Data Source And Fetching

- Create or extend `src/lib/db/items.ts` with database functions for stats and sidebar item types
- Fetch stats and sidebar data from the database instead of mock data
- Use Prisma with the Neon database as the source of truth
- Use `src/lib/db/collections.ts` as the reference for sidebar collection shaping where helpful

### Sidebar And Stats Behavior

- Keep the current dashboard design and layout intact
- Display stats using database-backed values
- Display item types in the sidebar with their icons and links to `/items/[typename]`
- Show actual collection data in the sidebar
- Add a `View all collections` link beneath the collections list that routes to `/collections`
- Keep star icons for favorite collections
- For recent collections, show a colored circle based on the most-used item type in that collection

## Notes

- Use the current dashboard UI and screenshot reference as the visual baseline
- This feature focuses on the remaining stats and sidebar areas still tied to mock dashboard data
- The existing UI should be preserved, with only the backing data and sidebar collection presentation becoming database-driven
- The collections database helper can be reused as a reference for recent collection coloring and shaping

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

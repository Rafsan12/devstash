# Current Feature

Dashboard Collections

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

- Replace the dashboard's dummy recent collection cards with real database-backed data
- Fetch collection data from Neon through Prisma instead of `@src/lib/mock-data.ts`
- Preserve the existing dashboard collection card layout and visual design
- Prepare collection data and stats for future item rendering without adding collection items yet
- Keep the implementation modular by introducing collection-specific database access helpers

## Requirements

### Data Source And Fetching

- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in the dashboard server component
- Use Prisma with the Neon database as the source of truth
- Stop using `@src/lib/mock-data.ts` for the main dashboard collection cards

### Collection Card Behavior

- Keep the existing recent collections card design and current six-card presentation
- Derive each collection card border color from the most-used content type in that collection
- Show small icons representing all content types present in the collection
- Update the collection stats display to use real database data
- Do not render collection items beneath the cards yet

## Notes

- Use the current dashboard UI and screenshot reference as the visual baseline
- This feature replaces the previous seed-data direction as the active focus
- The design should remain unchanged while the data source becomes real and scalable
- Future work will add items beneath the collection cards, but that is explicitly out of scope for now

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

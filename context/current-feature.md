# Current Feature

Dashboard Items

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

- Replace the dashboard's dummy pinned and recent item data with real database-backed data
- Fetch item data from Neon through Prisma instead of `@src/lib/mock-data.ts`
- Preserve the existing dashboard item layout and visual design in the main dashboard area
- Keep the implementation modular by introducing item-specific database access helpers
- Ensure empty pinned states stay hidden when there are no pinned items

## Requirements

### Data Source And Fetching

- Create `src/lib/db/items.ts` with data fetching functions
- Fetch items directly in the dashboard server component
- Use Prisma with the Neon database as the source of truth
- Stop using `@src/lib/mock-data.ts` for pinned and recent dashboard items

### Item Card Behavior

- Keep the current pinned and recent item presentation as it exists today
- Derive each item card icon and border styling from the item type
- Display item type tags and any other metadata already shown in the current UI
- Update collection stats display
- Render nothing in the pinned section when there are no pinned items

## Notes

- Use the current dashboard UI and screenshot reference as the visual baseline
- The design should remain unchanged while the item data source becomes real and scalable
- This feature covers the main dashboard area on the right side, including pinned and recent items
- The existing UI should be preserved, with only the backing data and related stats becoming database-driven

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

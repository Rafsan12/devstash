# Current Feature

Seed Development Data

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

- Create a `prisma/seed.ts` script for development and demo data
- Seed a demo user with the required profile and authentication fields
- Seed the system item types with Lucide icon names and colors
- Seed sample collections and items that reflect realistic DevStash usage
- Make the existing seed setup safe to overwrite with the new dataset

## Seed Requirements

### Demo User

- Email: `demo@devstash.io`
- Name: `Demo User`
- Password: `12345678` hashed with `bcryptjs` using 12 rounds
- `isPro: false`
- `emailVerified`: current date

### System Item Types

All item types should be seeded with `isSystem: true`.

| Name      | Icon         | Color   |
| --------- | ------------ | ------- |
| `snippet` | `Code`       | `#3b82f6` |
| `prompt`  | `Sparkles`   | `#8b5cf6` |
| `command` | `Terminal`   | `#f97316` |
| `note`    | `StickyNote` | `#fde047` |
| `file`    | `File`       | `#6b7280` |
| `image`   | `Image`      | `#ec4899` |
| `link`    | `Link`       | `#10b981` |

### Collections And Items

#### React Patterns

Description: Reusable React patterns and hooks

- 3 `snippet` items written in TypeScript
- Cover custom hooks such as `useDebounce` and `useLocalStorage`
- Cover component patterns such as context providers and compound components
- Include utility-focused examples

#### AI Workflows

Description: AI prompts and workflow automations

- 3 `prompt` items
- Cover code review prompts
- Cover documentation generation
- Cover refactoring assistance

#### DevOps

Description: Infrastructure and deployment resources

- 1 `snippet` item for Docker or CI/CD config
- 1 `command` item for deployment scripts
- 2 `link` items using real documentation URLs

#### Terminal Commands

Description: Useful shell commands for everyday development

- 4 `command` items
- Cover Git operations
- Cover Docker commands
- Cover process management
- Cover package manager utilities

#### Design Resources

Description: UI/UX resources and references

- 4 `link` items using real URLs
- Include CSS or Tailwind references
- Include component libraries
- Include design systems
- Include icon libraries

## Notes

- This feature replaces the previous seed direction and can overwrite the current seed file contents
- Seed data should feel polished enough for local demos, screenshots, and onboarding
- Use deterministic values where practical so reseeding remains predictable

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

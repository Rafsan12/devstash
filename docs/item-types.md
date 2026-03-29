# Item Types

This document describes the current system item types in DevStash based on the active Prisma schema, seed data, and dashboard UI mappings.

## Source of truth

- Current backend model: `prisma/schema/item-type.prisma` and `prisma/schema/item.prisma`
- Seeded system types: `prisma/seed.ts`
- Current dashboard labels/routes/counts: `src/lib/db/items.ts`
- Legacy/mock-only mappings: `src/lib/mock-data.ts` and `src/lib/dashboard-utils.ts`

`src/lib/constants.tsx` is referenced by the research prompt but does not exist in the current codebase.

## Current model

Item types are no longer a Prisma enum. They are stored in the `ItemType` table and referenced from `Item.itemTypeId`.

### Shared item type metadata

Each item type record currently stores:

- `id`: stable type key used across routes and item records
- `icon`: icon token rendered by the dashboard UI
- `color`: hex color used for borders, badges, and accents
- `isSystem`: marks built-in types shown in the sidebar
- `createdAt`: creation timestamp for the item type record

### Shared item fields

All items currently use the same base schema regardless of type:

- `title`
- `content`
- `itemTypeId`
- `fileExtension`
- `collectionId`
- `userId`
- `isPinned`
- `createdAt`
- `updatedAt`

There are no type-specific database columns yet. Type behavior is currently inferred from `itemTypeId`, `fileExtension`, and how `content` is interpreted.

## The 7 system item types

| Type | Icon | Hex color | Purpose | Key fields used |
| --- | --- | --- | --- | --- |
| `snippet` | `Code` | `#3b82f6` | Store reusable code snippets and script fragments. | `content`, `fileExtension` like `.ts` or `.yml`, `itemTypeId` |
| `prompt` | `Sparkles` | `#8b5cf6` | Store reusable AI prompts and prompt templates. | `content`, `fileExtension` `.prompt`, `itemTypeId` |
| `command` | `Terminal` | `#f97316` | Store executable or reference shell commands. | `content`, `fileExtension` `.sh`, `itemTypeId` |
| `note` | `StickyNote` | `#fde047` | Store markdown-style notes and written references. | `content`, `fileExtension` typically `.md`, `itemTypeId` |
| `file` | `File` | `#6b7280` | Store file-like reference content inside the item model. | `content`, `fileExtension`, `itemTypeId` |
| `image` | `Image` | `#ec4899` | Reserved for saved visual assets or references. | `content` or future asset reference, `fileExtension`, `itemTypeId` |
| `link` | `Link` | `#10b981` | Store URLs and external references. | `content` as URL, `fileExtension` `.url`, `itemTypeId` |

## Classification summary

### Text-backed types

These are primarily freeform text content stored directly in `Item.content`:

- `snippet`
- `prompt`
- `command`
- `note`
- `file`

### URL-backed type

This type still uses `Item.content`, but the content is expected to be a URL string:

- `link`

### File/asset-oriented type

This type exists in the system metadata but does not yet have a dedicated storage model:

- `image`

At the moment, images do not have special asset fields such as `fileUrl`, MIME type, dimensions, or thumbnails. The project overview also treats uploads/attachments as future work.

## Per-type behavior notes

### Snippet

- Seed data uses `.ts` and `.yml`
- Best fit for code-heavy content
- Legacy project overview called this `code`; the current system has renamed it to `snippet`

### Prompt

- Uses `.prompt`
- Content is natural language instructions for AI workflows
- Displayed as a normal item card today, not with a special prompt editor

### Command

- Uses `.sh` in seed data
- Content is plain text command sequences
- Semantically distinct from snippets even though both are text-backed

### Note

- Intended for markdown-ready note content
- Replaces the older `markdown` enum from the initial project overview
- Aligns best with the product direction that notes should behave like files and support future markdown rendering

### File

- Functions as a generic file-like content type inside the current text-based item model
- Can overlap with note behavior today because there is no separate blob/file storage
- The sidebar currently marks `file` as `PRO`

### Image

- Exists as a system item type and route
- No seeded demo items currently use `image`
- The sidebar currently marks `image` as `PRO`
- Current route is a placeholder; no image-specific viewer or storage flow exists yet

### Link

- Uses `.url` in seed data
- Seeded content is a raw URL in `Item.content`
- Best understood as an external reference type, not a rich bookmark model

## Shared UI behavior

Current dashboard rendering does not branch deeply by type. Most types share the same card and sidebar treatment.

### Shared display patterns

- Sidebar shows all system item types in a fixed order: snippet, prompt, command, note, file, image, link
- Item counts are grouped by `itemTypeId`
- Item cards use the type color for border, badge, and icon accents
- Item cards derive tags from `itemTypeId`, `fileExtension`, and collection name
- Item preview text is always generated from normalized `content`

### Current display differences

- Sidebar labels map each type to a pluralized route such as `/items/snippets` or `/items/links`
- `file` and `image` show a `PRO` badge in the sidebar
- Item-type route pages currently only show type-specific title/description copy and are otherwise placeholder pages
- Icons differ per type through the `ItemTypeIcon` component

## Gaps and drift to be aware of

- `context/project-overview.md` still documents the older 4-type enum system: `markdown`, `code`, `prompt`, `text`
- The active schema has already moved to 7 lookup-table-backed item types
- `src/lib/constants.tsx` is no longer present, so type metadata now comes from seed data and DB queries instead
- There are no type-specific persistence fields yet, so `file`, `note`, and `image` are mostly differentiated by intention and UI labeling rather than storage shape
- `image` is defined but not represented in seeded demo items

## Practical takeaway

DevStash currently has a unified item model with seven system-defined item types. The main distinctions today are semantic labeling, icon/color metadata, route grouping, and a few UI badges. Richer type-specific behavior such as markdown rendering, uploaded files, image assets, and specialized editors still appears to be planned rather than implemented.

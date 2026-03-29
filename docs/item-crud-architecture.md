# Item CRUD Architecture

This document describes the design of a unified CRUD system for all 7 item types (snippet, prompt, command, note, file, image, link) in DevStash. Because all items map to the exact same backend model, this architecture uses a single shared backend implementation while accommodating type-specific behaviors purely in the presentation layer.

## 1. Unified File Structure

The architecture enforces a strict separation between mutating actions, raw data fetching, and UI components.

- **Data Access Layer (`src/lib/db/items.ts`)**
  - Contains database queries for items, such as `getItemById`, `getItemsByType`, `getAllItems`, and dashboard-specific queries.
  - Exported functions are called directly from React Server Components.
- **Server Actions (`src/app/actions/item-actions.ts`)**
  - **One action file** manages all item mutations.
  - Contains `createItem`, `updateItem`, `deleteItem`, and interactions like `togglePinItem`.
  - Type-agnostic validation happens here. All payloads use the foundational attributes of an `Item` (`title`, `content`, `itemTypeId`, `collectionId`, `fileExtension`).
- **Pages & Routing**
  - `src/app/items/[type]/page.tsx`: Maps the type parameter to `itemTypeId` and loads the item list view.
  - `src/app/items/[type]/new/page.tsx`: Route for creating an item of a specific type.
  - `src/app/items/[id]/page.tsx`: Generic item details/editing view.
- **Shared Components (`src/components/item/`)**
  - `ItemList.tsx`: Renders grids/lists of items.
  - `ItemCard.tsx`: Reusable preview component for individual items, styled based on the `color` and `icon` of the item type.
  - `ItemEditor.tsx`: The primary wrapper component governing the actual creation/editing experience.
  - `ItemForm.tsx`: Shared wrapper for capturing generic inputs (like `title`, `collectionId`) alongside the specific content editor.

## 2. Dynamic Routing (`/items/[type]`)

DevStash leverages Next.js dynamic routes to organize list views without requiring dedicated folder structures for each type.

1. **Parameter Mapping:** When a user visits `/items/snippets`, the `[type]` segment is captured as `"snippets"`. 
2. **Resolution:** A mapping utility (e.g., `itemTypeRouteMap` in `src/lib/db/items.ts`) translates the URL segment back to the underlying `itemTypeId` (e.g., `'snippet'`).
3. **Data Fetching:** The Server Component uses this `itemTypeId` to call `getItemsByType` and pulls the relevant records from PostgreSQL.
4. **Rendering:** The generic `ItemList` display receives the items to render standard `ItemCard` structures, preserving a mostly identical layout regardless of the viewed type.

## 3. Where Type-Specific Logic Lives

In order to keep the backend robust and unified, **actions remain type-agnostic** while **components handle type-specific behaviors.**

- **Server actions only care about schema logic.** A snippet with TypeScript code looks identical to a prompt text block in `src/app/actions/item-actions.ts`. Both simply involve reading the input and saving it as the `content` string column on the `Item` model. Actions do not try to parse or execute code.
- **Type-specific behaviors live entirely in sub-components.** When modifying the item, the `ItemForm` wrapper dynamically swaps the input mechanism based on `itemTypeId`:
  - `note` type mounts a unified TipTap-based Markdown editor component.
  - `snippet` type mounts a CodeMirror component for code syntax highlighting.
  - `link` type mounts a simple URL text input control.

## 4. Component Responsibilities

- **`ItemList` (Server Component)**
  - Resolves queries against the `lib/db/items.ts` API.
  - Handles pagination or lazy loading boundaries.
- **`ItemForm` (Client Component)**
  - Accepts `initialData` (for edits) or acts as a blank slate with a preselected `itemTypeId` (for creations).
  - Maintains intermediate form state using `react-hook-form` and `zod`.
  - Determines which `ContentInput` UI control (e.g., `MarkdownEditor`, `CodeEditor`) to render based on the current item type.
  - Makes asynchronous calls to `src/app/actions/item-actions.ts` mutations when the user clicks 'Save'.
- **`ContentInput` Controls (Client Components)**
  - These are the specific editing mechanisms like `TipTapEditor.tsx` or `CodeEditor.tsx`.
  - They solely manage input formatting, syntax highlighting, or WYSIWYG manipulations.
  - They do not submit forms or talk to the server; their responsibility is to emit clean string data continuously back to the parent `ItemForm` via `onChange={}` props.
- **`ItemCard` (Server/Client Component)**
  - Accepts a `DashboardItemCardData` representation.
  - Dynamically renders border colors, UI badges, and tag previews using the provided type metadata (`color` and `icon`).
  - Calls actions directly for atomic interactions, such as `togglePinItem(id)` or `deleteItem(id)`.

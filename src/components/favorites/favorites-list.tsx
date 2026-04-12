"use client";

import { useRouter } from "next/navigation";
import { type FavoriteItem, type FavoriteCollection } from "@/lib/db/favorites";
import { useItemDrawer } from "@/components/dashboard/item-drawer-provider";
import { ItemTypeIcon, withAlpha } from "@/components/dashboard/item-type-icon";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      <span className="font-mono text-xs text-zinc-600">({count})</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

function ItemRow({ item, onClick }: { item: FavoriteItem; onClick: () => void }) {
  return (
    <button
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/[0.04]"
      onClick={onClick}
      type="button"
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
        style={{
          borderColor: withAlpha(item.itemType.color, "40"),
          backgroundColor: withAlpha(item.itemType.color, "14"),
          color: item.itemType.color,
        }}
      >
        <ItemTypeIcon icon={item.itemType.icon} />
      </span>

      <span className="min-w-0 flex-1 font-mono text-sm text-zinc-200 truncate group-hover:text-white">
        {item.title}
      </span>

      <span
        className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
        style={{
          backgroundColor: withAlpha(item.itemType.color, "1a"),
          color: item.itemType.color,
        }}
      >
        {item.fileExtension || item.itemTypeId}
      </span>

      <span className="shrink-0 font-mono text-xs text-zinc-600">
        {formatDate(item.updatedAt)}
      </span>

      <span className="shrink-0 text-amber-400/60">
        <StarIcon filled />
      </span>
    </button>
  );
}

function CollectionRow({
  collection,
  onClick,
}: {
  collection: FavoriteCollection;
  onClick: () => void;
}) {
  return (
    <button
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/[0.04]"
      onClick={onClick}
      type="button"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400">
        <FolderIcon />
      </span>

      <span className="min-w-0 flex-1 font-mono text-sm text-zinc-200 truncate group-hover:text-white">
        {collection.name}
      </span>

      <span className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider bg-white/[0.04] text-zinc-500">
        collection
      </span>

      <span className="shrink-0 font-mono text-xs text-zinc-600">
        {formatDate(collection.updatedAt)}
      </span>

      <span className="shrink-0 text-amber-400/60">
        <StarIcon filled />
      </span>
    </button>
  );
}

export function FavoritesList({
  items,
  collections,
}: {
  items: FavoriteItem[];
  collections: FavoriteCollection[];
}) {
  const { openItem } = useItemDrawer();
  const router = useRouter();

  const isEmpty = items.length === 0 && collections.length === 0;

  if (isEmpty) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02]">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-500">
            <StarIcon />
          </div>
          <p className="text-sm text-zinc-500">No favorites yet.</p>
          <p className="mt-1 text-xs text-zinc-600">
            Star items and collections to find them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.length > 0 && (
        <div className="space-y-1">
          <SectionHeader count={items.length} label="Items" />
          <div>
            {items.map((item) => (
              <ItemRow
                item={item}
                key={item.id}
                onClick={() => openItem(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {collections.length > 0 && (
        <div className="space-y-1">
          <SectionHeader count={collections.length} label="Collections" />
          <div>
            {collections.map((collection) => (
              <CollectionRow
                collection={collection}
                key={collection.id}
                onClick={() => router.push(`/collections/${collection.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

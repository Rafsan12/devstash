"use client";

import { type DashboardItemCardData } from "@/lib/db/items";
import { ItemTypeIcon, withAlpha } from "./item-type-icon";

function StarIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  ) : (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function ItemCard({
  item,
  isFavorite,
  onToggleFavorite,
}: {
  item: DashboardItemCardData;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}) {
  return (
    <article
      className="flex flex-col justify-between rounded-[22px] border bg-black/30 p-5 transition hover:bg-white/2"
      style={{
        borderColor: withAlpha(item.itemType.color, "52"),
        boxShadow: `inset 0 1px 0 ${withAlpha(item.itemType.color, "24")}`,
      }}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          {item.isPinned ? (
            <span className="shrink-0 rounded-full bg-blue-400/15 px-2.5 py-1 text-xs font-medium text-blue-200">
              Pinned
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{item.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
        <div className="flex gap-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md border px-2 py-1 text-xs uppercase tracking-[0.14em]"
              style={{
                borderColor: withAlpha(item.itemType.color, "40"),
                backgroundColor: withAlpha(item.itemType.color, "14"),
                color: item.itemType.color,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {onToggleFavorite !== undefined && (
            <button
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-white/10 ${isFavorite ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"}`}
              onClick={onToggleFavorite}
              type="button"
            >
              <StarIcon filled={isFavorite} />
            </button>
          )}
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
            style={{
              borderColor: withAlpha(item.itemType.color, "5c"),
              backgroundColor: withAlpha(item.itemType.color, "14"),
              color: item.itemType.color,
            }}
          >
            <ItemTypeIcon icon={item.itemType.icon} />
          </span>
        </div>
      </div>
    </article>
  );
}

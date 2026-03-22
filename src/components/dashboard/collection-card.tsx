import { type DashboardRecentCollection } from "@/lib/db/collections";
import { ItemTypeIcon, withAlpha } from "./item-type-icon";

export function CollectionCard({ collection }: { collection: DashboardRecentCollection }) {
  return (
    <article
      className="rounded-[22px] border bg-black/30 p-5 transition hover:bg-white/[0.02]"
      style={{
        borderColor: withAlpha(collection.dominantTypeColor, "52"),
        boxShadow: `inset 0 1px 0 ${withAlpha(collection.dominantTypeColor, "24")}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{collection.description}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            backgroundColor: withAlpha(collection.dominantTypeColor, "1f"),
            color: collection.dominantTypeColor,
          }}
        >
          {collection.typeCount} types
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-zinc-500">
        <span>{collection.itemCount} items</span>
        <div className="flex items-center gap-2">
          <span>{collection.typeCount} content types</span>
          <div className="flex items-center gap-1.5">
            {collection.types.map((type) => (
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full border"
                key={type.id}
                style={{
                  borderColor: withAlpha(type.color, "5c"),
                  backgroundColor: withAlpha(type.color, "14"),
                  color: type.color,
                }}
                title={type.id}
              >
                <ItemTypeIcon icon={type.icon} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

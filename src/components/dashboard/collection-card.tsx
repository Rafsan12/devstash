import { DashboardCollection } from "@/lib/mock-data";

export function CollectionCard({ collection }: { collection: DashboardCollection }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-black/30 p-5 transition hover:bg-white/[0.02]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{collection.description}</p>
        </div>
        {collection.isFavorite ? (
          <span className="shrink-0 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-medium text-amber-200">
            Favorite
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
        <span>{collection.itemCount} items</span>
        <span className="uppercase">{collection.itemTypeIds.join(" / ")}</span>
      </div>
    </article>
  );
}

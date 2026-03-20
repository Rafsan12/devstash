import { DashboardItem } from "@/lib/mock-data";
import { itemTypeIconMap } from "@/lib/dashboard-utils";

export function ItemCard({ item }: { item: DashboardItem }) {
  return (
    <article className="flex flex-col justify-between rounded-[22px] border border-white/8 bg-black/30 p-5 transition hover:bg-white/[0.02]">
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
            <span key={tag} className="rounded-md bg-white/5 px-2 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/5 bg-white/5 text-[10px] font-semibold text-sky-200">
          {itemTypeIconMap[item.itemTypeId]}
        </span>
      </div>
    </article>
  );
}

import { type DashboardStats, type DashboardSidebarItemType } from "@/lib/db/items";
import { ItemTypeIcon } from "@/components/dashboard/item-type-icon";
import { StatCard } from "@/components/dashboard/stat-card";

export function UsageStatsCard({
  stats,
  itemTypes,
}: {
  stats: DashboardStats;
  itemTypes: DashboardSidebarItemType[];
}) {
  // Sort by count descending, then alphabetically
  const sortedTypes = [...itemTypes].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 shadow-xl shadow-black/20 backdrop-blur overflow-hidden flex flex-col h-full">
      <div className="border-b border-white/10 px-6 py-5">
        <h3 className="text-lg font-semibold text-white">Usage Statistics</h3>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Items" value={stats.totalItems.toString()} />
          <StatCard label="Collections" value={stats.totalCollections.toString()} />
          <StatCard label="Pinned Items" value={stats.pinnedItems.toString()} />
          <StatCard label="Recent Updates" value={stats.recentItems.toString()} />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Item Breakdown</h4>
          <div className="space-y-2">
            {sortedTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.02)_100%)] text-sky-200 border border-white/5 shadow-inner shadow-white/10">
                    <ItemTypeIcon icon={type.icon} />
                  </span>
                  <span className="text-sm font-medium text-zinc-200">{type.name}</span>
                </div>
                <span className="text-sm font-semibold text-zinc-400">{type.count}</span>
              </div>
            ))}
            {sortedTypes.every(t => t.count === 0) && (
               <p className="text-center text-sm text-zinc-500 py-4">No items created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { type DashboardStats } from "@/lib/db/items";
import { StatCard } from "./stat-card";

export function StatsCardsSection({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="Total Items" value={stats.totalItems.toString()} />
      <StatCard label="Collections" value={stats.totalCollections.toString()} />
      <StatCard label="Pinned Items" value={stats.pinnedItems.toString()} />
      <StatCard label="Recent Items" value={stats.recentItems.toString()} />
    </div>
  );
}

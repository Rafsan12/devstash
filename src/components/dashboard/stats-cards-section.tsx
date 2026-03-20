import { mockDashboardData } from "@/lib/mock-data";
import { favoriteCollections } from "@/lib/dashboard-utils";
import { StatCard } from "./stat-card";

export function StatsCardsSection() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard label="Total Items" value={mockDashboardData.items.length.toString()} />
      <StatCard label="Collections" value={mockDashboardData.collections.length.toString()} />
      <StatCard label="Pinned Items" value={mockDashboardData.items.filter((i) => i.isPinned).length.toString()} />
      <StatCard label="Favorite Collections" value={favoriteCollections.length.toString()} />
    </div>
  );
}

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PinnedItemsSection } from "@/components/dashboard/pinned-items-section";
import { RecentCollectionsSection } from "@/components/dashboard/recent-collections-section";
import { RecentItemsSection } from "@/components/dashboard/recent-items-section";
import { StatsCardsSection } from "@/components/dashboard/stats-cards-section";
import { getRecentDashboardCollections } from "@/lib/db/collections";
import {
  getDashboardStats,
  getPinnedDashboardItems,
  getRecentDashboardItems,
} from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, pinnedItems, recentCollections, recentItems] = await Promise.all([
    getDashboardStats(),
    getPinnedDashboardItems(),
    getRecentDashboardCollections(),
    getRecentDashboardItems(),
  ]);

  return (
    <DashboardShell>
      <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
        <StatsCardsSection stats={stats} />
        <PinnedItemsSection items={pinnedItems} />
        <RecentCollectionsSection collections={recentCollections} />
        <RecentItemsSection items={recentItems} />
      </section>
    </DashboardShell>
  );
}

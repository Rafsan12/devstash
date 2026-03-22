import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PinnedItemsSection } from "@/components/dashboard/pinned-items-section";
import { RecentCollectionsSection } from "@/components/dashboard/recent-collections-section";
import { RecentItemsSection } from "@/components/dashboard/recent-items-section";
import { StatsCardsSection } from "@/components/dashboard/stats-cards-section";
import {
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
  getRecentSidebarCollections,
} from "@/lib/db/collections";
import {
  getDashboardSidebarItemTypes,
  getDashboardSidebarUser,
  getDashboardStats,
  getPinnedDashboardItems,
  getRecentDashboardItems,
} from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    stats,
    pinnedItems,
    recentCollections,
    recentItems,
    sidebarItemTypes,
    favoriteCollections,
    sidebarRecentCollections,
    sidebarUser,
  ] = await Promise.all([
    getDashboardStats(),
    getPinnedDashboardItems(),
    getRecentDashboardCollections(),
    getRecentDashboardItems(),
    getDashboardSidebarItemTypes(),
    getFavoriteSidebarCollections(),
    getRecentSidebarCollections(),
    getDashboardSidebarUser(),
  ]);

  return (
    <DashboardShell
      favoriteCollections={favoriteCollections}
      recentCollections={sidebarRecentCollections}
      sidebarItemTypes={sidebarItemTypes}
      user={sidebarUser}
    >
      <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
        <StatsCardsSection stats={stats} />
        <PinnedItemsSection items={pinnedItems} />
        <RecentCollectionsSection collections={recentCollections} />
        <RecentItemsSection items={recentItems} />
      </section>
    </DashboardShell>
  );
}

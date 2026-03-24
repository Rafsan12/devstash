import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PinnedItemsSection } from "@/components/dashboard/pinned-items-section";
import { RecentCollectionsSection } from "@/components/dashboard/recent-collections-section";
import { RecentItemsSection } from "@/components/dashboard/recent-items-section";
import { StatsCardsSection } from "@/components/dashboard/stats-cards-section";
import { getFavoriteSidebarCollections, getRecentDashboardCollections } from "@/lib/db/collections";
import { getDemoDashboardUser } from "@/lib/db/dashboard-user";
import {
  getDashboardSidebarItemTypes,
  getDashboardSidebarUser,
  getDashboardStats,
  getPinnedDashboardItems,
  getRecentDashboardItems,
} from "@/lib/db/items";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const demoUser = await getDemoDashboardUser();
  const userId = demoUser?.id ?? null;

  const [
    stats,
    pinnedItems,
    recentCollections,
    recentItems,
    sidebarItemTypes,
    favoriteCollections,
  ] = await Promise.all([
    getDashboardStats(userId),
    getPinnedDashboardItems(userId),
    getRecentDashboardCollections(userId),
    getRecentDashboardItems(userId),
    getDashboardSidebarItemTypes(userId),
    getFavoriteSidebarCollections(userId),
  ]);

  const sidebarRecentCollections = recentCollections.slice(0, 3).map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    itemCount: collection.itemCount,
    dominantTypeColor: collection.dominantTypeColor,
  }));

  return (
    <DashboardShell
      favoriteCollections={favoriteCollections}
      recentCollections={sidebarRecentCollections}
      sidebarItemTypes={sidebarItemTypes}
      user={getDashboardSidebarUser(demoUser)}
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

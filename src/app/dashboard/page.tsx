import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PinnedItemsSection } from "@/components/dashboard/pinned-items-section";
import { RecentCollectionsSection } from "@/components/dashboard/recent-collections-section";
import { RecentItemsSection } from "@/components/dashboard/recent-items-section";
import { StatsCardsSection } from "@/components/dashboard/stats-cards-section";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
        <StatsCardsSection />
        <PinnedItemsSection />
        <RecentCollectionsSection />
        <RecentItemsSection />
      </section>
    </DashboardShell>
  );
}
import { mockDashboardData } from "@/lib/mock-data";
import { ItemCard } from "./item-card";

export function RecentItemsSection() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">Recent Items</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...mockDashboardData.items]
          .sort((a, b) => b.lastViewedAt.localeCompare(a.lastViewedAt))
          .slice(0, 10)
          .map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
      </div>
    </section>
  );
}

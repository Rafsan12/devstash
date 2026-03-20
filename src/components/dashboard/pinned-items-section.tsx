import { mockDashboardData } from "@/lib/mock-data";
import { ItemCard } from "./item-card";

export function PinnedItemsSection() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">Pinned Items</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockDashboardData.items
          .filter((i) => i.isPinned)
          .map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
      </div>
    </section>
  );
}

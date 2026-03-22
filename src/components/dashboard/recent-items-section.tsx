import { type DashboardItemCardData } from "@/lib/db/items";
import { ItemCard } from "./item-card";

export function RecentItemsSection({ items }: { items: DashboardItemCardData[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">Recent Items</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

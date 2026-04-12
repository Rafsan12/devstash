import { type DashboardItemCardData } from "@/lib/db/items";
import { ClickableItemCard } from "./item-drawer-provider";

export function RecentItemsSection({ items }: { items: DashboardItemCardData[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">Recent Items</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ClickableItemCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}

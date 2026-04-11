import { type DashboardRecentCollection } from "@/lib/db/collections";
import { ClickableCollectionCard } from "./clickable-collection-card";

export function RecentCollectionsSection({
  collections,
}: {
  collections: DashboardRecentCollection[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">Recent Collections</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <ClickableCollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}

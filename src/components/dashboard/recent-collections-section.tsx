import { recentCollections } from "@/lib/dashboard-utils";
import { CollectionCard } from "./collection-card";

export function RecentCollectionsSection() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">Recent Collections</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recentCollections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ItemCard } from "@/components/dashboard/item-card";
import {
  ClickableItemCard,
  ItemDrawerProvider,
} from "@/components/dashboard/item-drawer-provider";
import { CollectionDetailActions } from "@/components/dashboard/collection-detail-actions";
import {
  ensureStarterCollection,
  getAllCollections,
  getCollectionById,
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import {
  getDashboardItemsByCollection,
  getDashboardSidebarItemTypes,
  getDashboardSidebarUser,
} from "@/lib/db/items";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const authenticatedUser = await getAuthenticatedDashboardUser();
  const userId = authenticatedUser?.id ?? null;

  await ensureStarterCollection(userId);

  const [
    collection,
    recentCollections,
    sidebarItemTypes,
    favoriteCollections,
    allCollections,
    items,
  ] = await Promise.all([
    getCollectionById(userId, id),
    getRecentDashboardCollections(userId),
    getDashboardSidebarItemTypes(userId),
    getFavoriteSidebarCollections(userId),
    getAllCollections(userId),
    getDashboardItemsByCollection(userId, id),
  ]);

  if (!collection) {
    notFound();
  }

  const sidebarRecentCollections = recentCollections.slice(0, 3).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    itemCount: c.itemCount,
    dominantTypeColor: c.dominantTypeColor,
  }));

  return (
    <ItemDrawerProvider collections={allCollections}>
      <DashboardShell
        allCollections={allCollections}
        favoriteCollections={favoriteCollections}
        recentCollections={sidebarRecentCollections}
        sidebarItemTypes={sidebarItemTypes}
        user={getDashboardSidebarUser(authenticatedUser)}
      >
        <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{collection.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{collection.description}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <CollectionDetailActions collection={collection} />
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {items.map((item) => (
                <ClickableItemCard item={item} key={item.id}>
                  <ItemCard item={item} />
                </ClickableItemCard>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/2">
              <p className="text-sm text-zinc-500">No items in this collection yet.</p>
            </div>
          )}
        </section>
      </DashboardShell>
    </ItemDrawerProvider>
  );
}

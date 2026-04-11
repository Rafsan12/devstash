import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ItemCard } from "@/components/dashboard/item-card";
import {
  ClickableItemCard,
  ItemDrawerProvider,
} from "@/components/dashboard/item-drawer-provider";
import {
  ensureStarterCollection,
  getAllCollections,
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import {
  getDashboardSidebarItemTypes,
  getDashboardSidebarUser,
  getDashboardItemsByType,
  getItemTypeIdFromRoute,
} from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";
import { notFound } from "next/navigation";

export default async function ItemTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const itemTypeId = getItemTypeIdFromRoute(type);

  if (!itemTypeId) {
    notFound();
  }

  const authenticatedUser = await getAuthenticatedDashboardUser();
  const userId = authenticatedUser?.id ?? null;

  await ensureStarterCollection(userId);

  const [
    recentCollections,
    sidebarItemTypes,
    favoriteCollections,
    allCollections,
    items,
    searchData,
  ] = await Promise.all([
    getRecentDashboardCollections(userId),
    getDashboardSidebarItemTypes(userId),
    getFavoriteSidebarCollections(userId),
    getAllCollections(userId),
    getDashboardItemsByType(userId, itemTypeId),
    getSearchData(userId),
  ]);

  const sidebarRecentCollections = recentCollections.slice(0, 3).map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    itemCount: collection.itemCount,
    dominantTypeColor: collection.dominantTypeColor,
  }));

  const itemTypeData = sidebarItemTypes.find((t) => t.id === itemTypeId);

  return (
    <ItemDrawerProvider collections={allCollections}>
      <DashboardShell
        allCollections={allCollections}
        favoriteCollections={favoriteCollections}
        recentCollections={sidebarRecentCollections}
        searchData={searchData}
        sidebarItemTypes={sidebarItemTypes}
        user={getDashboardSidebarUser(authenticatedUser)}
      >
        <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {itemTypeData?.name ?? type}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Browse and manage your {itemTypeData?.name.toLowerCase() ?? type}.
            </p>
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
            <div className="flex h-64 items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-sm text-zinc-500">No items found.</p>
            </div>
          )}
        </section>
      </DashboardShell>
    </ItemDrawerProvider>
  );
}

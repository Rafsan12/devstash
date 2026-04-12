import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  ClickableItemCard,
  ItemDrawerProvider,
} from "@/components/dashboard/item-drawer-provider";
import { PaginationControls } from "@/components/dashboard/pagination-controls";
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
import { SIDEBAR_RECENT_COLLECTIONS_LIMIT, parsePageParam } from "@/lib/pagination";
import { getSearchData } from "@/lib/db/search";

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;

  const authenticatedUser = await getAuthenticatedDashboardUser();
  const userId = authenticatedUser?.id ?? null;

  await ensureStarterCollection(userId);

  const [
    collection,
    recentCollections,
    sidebarItemTypes,
    favoriteCollections,
    allCollections,
    paginatedItems,
    searchData,
  ] = await Promise.all([
    getCollectionById(userId, id),
    getRecentDashboardCollections(userId),
    getDashboardSidebarItemTypes(userId),
    getFavoriteSidebarCollections(userId),
    getAllCollections(userId),
    getDashboardItemsByCollection(userId, id, parsePageParam(page)),
    getSearchData(userId),
  ]);

  if (!collection) {
    notFound();
  }

  const sidebarRecentCollections = recentCollections
    .slice(0, SIDEBAR_RECENT_COLLECTIONS_LIMIT)
    .map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    itemCount: c.itemCount,
    dominantTypeColor: c.dominantTypeColor,
  }));
  const { items, page: currentPage, totalCount, totalPages } = paginatedItems;

  return (
    <ItemDrawerProvider collections={allCollections}>
      <DashboardShell
        allCollections={allCollections}
        favoriteCollections={favoriteCollections}
        initialEditorPreferences={authenticatedUser?.editorPreferences}
        recentCollections={sidebarRecentCollections}
        searchData={searchData}
        sidebarItemTypes={sidebarItemTypes}
        user={getDashboardSidebarUser(authenticatedUser)}
      >
        <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">{collection.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{collection.description}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </p>
            </div>
            <CollectionDetailActions collection={collection} />
          </div>

          {items.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {items.map((item) => (
                  <ClickableItemCard item={item} key={item.id} />
                ))}
              </div>
              <PaginationControls
                createPageHref={(nextPage) => `/collections/${id}?page=${nextPage}`}
                currentPage={currentPage}
                totalPages={totalPages}
              />
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

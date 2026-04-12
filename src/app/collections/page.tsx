import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ClickableCollectionCard } from "@/components/dashboard/clickable-collection-card";
import { ItemDrawerProvider } from "@/components/dashboard/item-drawer-provider";
import {
  ensureStarterCollection,
  getAllCollections,
  getAllDashboardCollections,
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import {
  getDashboardSidebarItemTypes,
  getDashboardSidebarUser,
} from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";

export default async function CollectionsPage() {
  const authenticatedUser = await getAuthenticatedDashboardUser();
  const userId = authenticatedUser?.id ?? null;

  await ensureStarterCollection(userId);

  const [
    recentCollections,
    sidebarItemTypes,
    favoriteCollections,
    allCollections,
    allDashboardCollections,
    searchData,
  ] = await Promise.all([
    getRecentDashboardCollections(userId),
    getDashboardSidebarItemTypes(userId),
    getFavoriteSidebarCollections(userId),
    getAllCollections(userId),
    getAllDashboardCollections(userId),
    getSearchData(userId),
  ]);

  const sidebarRecentCollections = recentCollections.slice(0, 3).map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    itemCount: collection.itemCount,
    dominantTypeColor: collection.dominantTypeColor,
  }));

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
          <div>
            <h2 className="text-xl font-semibold text-white">All Collections</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {allDashboardCollections.length}{" "}
              {allDashboardCollections.length === 1 ? "collection" : "collections"}
            </p>
          </div>

          {allDashboardCollections.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {allDashboardCollections.map((collection) => (
                <ClickableCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-sm text-zinc-500">No collections yet. Create one to get started.</p>
            </div>
          )}
        </section>
      </DashboardShell>
    </ItemDrawerProvider>
  );
}

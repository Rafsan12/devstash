import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ItemDrawerProvider } from "@/components/dashboard/item-drawer-provider";
import { FavoritesList } from "@/components/favorites/favorites-list";
import {
  ensureStarterCollection,
  getAllCollections,
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import { getFavoriteItems, getFavoriteCollections } from "@/lib/db/favorites";
import {
  getDashboardSidebarItemTypes,
  getDashboardSidebarUser,
} from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";
import { SIDEBAR_RECENT_COLLECTIONS_LIMIT } from "@/lib/pagination";

export const metadata: Metadata = { title: "Favorites — DevStash" };

export default async function FavoritesPage() {
  const authenticatedUser = await getAuthenticatedDashboardUser();

  if (!authenticatedUser) {
    redirect("/sign-in");
  }

  const userId = authenticatedUser.id;

  await ensureStarterCollection(userId);

  const [
    recentCollections,
    sidebarItemTypes,
    favoriteCollections,
    allCollections,
    favoriteItems,
    favCollections,
    searchData,
  ] = await Promise.all([
    getRecentDashboardCollections(userId),
    getDashboardSidebarItemTypes(userId),
    getFavoriteSidebarCollections(userId),
    getAllCollections(userId),
    getFavoriteItems(userId),
    getFavoriteCollections(userId),
    getSearchData(userId),
  ]);

  const sidebarRecentCollections = recentCollections
    .slice(0, SIDEBAR_RECENT_COLLECTIONS_LIMIT)
    .map((c) => ({
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
        initialEditorPreferences={authenticatedUser.editorPreferences}
        recentCollections={sidebarRecentCollections}
        searchData={searchData}
        sidebarItemTypes={sidebarItemTypes}
        user={getDashboardSidebarUser(authenticatedUser)}
      >
        <section className="flex-1 space-y-8 px-4 py-6 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Favorites</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {favoriteItems.length + favCollections.length} starred item
              {favoriteItems.length + favCollections.length !== 1 ? "s" : ""}
            </p>
          </div>

          <FavoritesList
            collections={favCollections}
            items={favoriteItems}
          />
        </section>
      </DashboardShell>
    </ItemDrawerProvider>
  );
}

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ItemDrawerProvider } from "@/components/dashboard/item-drawer-provider";
import {
  ensureStarterCollection,
  getAllCollections,
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import { getDashboardSidebarItemTypes, getDashboardSidebarUser, getDashboardStats } from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";
import { ProfileHeader } from "@/components/profile/profile-header";
import { UsageStatsCard } from "@/components/profile/usage-stats-card";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | DevStash",
  description: "Manage your DevStash account and view your usage statistics.",
};

export default async function ProfilePage() {
  const authenticatedUser = await getAuthenticatedDashboardUser();
  const userId = authenticatedUser?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  await ensureStarterCollection(userId);

  const [
    userRecord,
    stats,
    sidebarItemTypes,
    recentCollections,
    favoriteCollections,
    allCollections,
    searchData,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true, createdAt: true },
    }),
    getDashboardStats(userId),
    getDashboardSidebarItemTypes(userId),
    getRecentDashboardCollections(userId),
    getFavoriteSidebarCollections(userId),
    getAllCollections(userId),
    getSearchData(userId),
  ]);

  if (!userRecord) {
    redirect("/sign-in");
  }

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
        recentCollections={sidebarRecentCollections}
        searchData={searchData}
        sidebarItemTypes={sidebarItemTypes}
        user={getDashboardSidebarUser(authenticatedUser)}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white">Profile</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              View your profile information and usage statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <ProfileHeader user={userRecord} />
            <UsageStatsCard itemTypes={sidebarItemTypes} stats={stats} />
          </div>
        </div>
      </DashboardShell>
    </ItemDrawerProvider>
  );
}

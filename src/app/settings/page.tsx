import { redirect } from "next/navigation";
import { type Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AccountActions } from "@/components/profile/account-actions";
import {
  ensureStarterCollection,
  getAllCollections,
  getFavoriteSidebarCollections,
  getRecentDashboardCollections,
} from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import { getDashboardSidebarItemTypes, getDashboardSidebarUser } from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Settings | DevStash",
  description: "Manage your account settings.",
};

export default async function SettingsPage() {
  const authenticatedUser = await getAuthenticatedDashboardUser();
  const userId = authenticatedUser?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  await ensureStarterCollection(userId);

  const [userRecord, sidebarItemTypes, recentCollections, favoriteCollections, allCollections, searchData] =
    await Promise.all([
      db.user.findUnique({ where: { id: userId }, select: { password: true } }),
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

  const isEmailUser = !!userRecord.password;

  return (
    <DashboardShell
      allCollections={allCollections}
      favoriteCollections={favoriteCollections}
      recentCollections={sidebarRecentCollections}
      searchData={searchData}
      sidebarItemTypes={sidebarItemTypes}
      user={getDashboardSidebarUser(authenticatedUser)}
    >
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Settings</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Manage your account security and preferences.
          </p>
        </div>

        <AccountActions isEmailUser={isEmailUser} />
      </div>
    </DashboardShell>
  );
}

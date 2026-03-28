import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getFavoriteSidebarCollections, getRecentDashboardCollections } from "@/lib/db/collections";
import { getAuthenticatedDashboardUser } from "@/lib/db/dashboard-user";
import { getDashboardSidebarItemTypes, getDashboardSidebarUser, getDashboardStats } from "@/lib/db/items";
import { ProfileHeader } from "@/components/profile/profile-header";
import { UsageStatsCard } from "@/components/profile/usage-stats-card";
import { AccountActions } from "@/components/profile/account-actions";
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

  const [
    userRecord,
    stats,
    sidebarItemTypes,
    recentCollections,
    favoriteCollections,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    }),
    getDashboardStats(userId),
    getDashboardSidebarItemTypes(userId),
    getRecentDashboardCollections(userId),
    getFavoriteSidebarCollections(userId),
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
      favoriteCollections={favoriteCollections}
      recentCollections={sidebarRecentCollections}
      sidebarItemTypes={sidebarItemTypes}
      user={getDashboardSidebarUser(authenticatedUser)}
    >
      <div className="flex flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-semibold text-white">Profile</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Manage your account settings and view your usage statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <ProfileHeader user={userRecord} />
            <AccountActions isEmailUser={isEmailUser} />
          </div>
          <div>
            <UsageStatsCard stats={stats} itemTypes={sidebarItemTypes} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

import "server-only";

import { db } from "@/lib/db";

const DEMO_USER_EMAIL = "demo@devstash.io";

type DashboardCollectionTypeSummary = {
  id: string;
  icon: string;
  color: string;
  count: number;
};

export type DashboardRecentCollection = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  typeCount: number;
  dominantTypeColor: string;
  types: DashboardCollectionTypeSummary[];
};

export type DashboardSidebarCollection = {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  dominantTypeColor: string;
};

type DashboardRecentCollectionWithActivity = DashboardRecentCollection & {
  lastActivityAt: Date;
};

function compareTypeSummaries(
  left: DashboardCollectionTypeSummary,
  right: DashboardCollectionTypeSummary,
) {
  if (right.count !== left.count) {
    return right.count - left.count;
  }

  return left.id.localeCompare(right.id);
}

async function getDemoUser() {
  return db.user.findUnique({
    where: {
      email: DEMO_USER_EMAIL,
    },
    select: {
      id: true,
    },
  });
}

export async function getRecentDashboardCollections(
  limit = 6,
): Promise<DashboardRecentCollection[]> {
  const demoUser = await getDemoUser();

  if (!demoUser) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: {
      userId: demoUser.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      items: {
        select: {
          updatedAt: true,
          itemTypeId: true,
          itemType: {
            select: {
              id: true,
              icon: true,
              color: true,
            },
          },
        },
      },
    },
  });

  return collections
    .map<DashboardRecentCollectionWithActivity>((collection) => {
      const typeMap = new Map<string, DashboardCollectionTypeSummary>();

      for (const item of collection.items) {
        const existingType = typeMap.get(item.itemTypeId);

        if (existingType) {
          existingType.count += 1;
          continue;
        }

        typeMap.set(item.itemTypeId, {
          id: item.itemType.id,
          icon: item.itemType.icon,
          color: item.itemType.color,
          count: 1,
        });
      }

      const types = [...typeMap.values()].sort(compareTypeSummaries);
      const lastActivityAt = collection.items.reduce((latest, item) => {
        return item.updatedAt > latest ? item.updatedAt : latest;
      }, collection.createdAt);

      return {
        id: collection.id,
        name: collection.name,
        description: collection.description ?? "No description yet.",
        itemCount: collection.items.length,
        typeCount: types.length,
        dominantTypeColor: types[0]?.color ?? "#27272a",
        types,
        lastActivityAt,
      };
    })
    .sort((left, right) => right.lastActivityAt.getTime() - left.lastActivityAt.getTime())
    .slice(0, limit)
    .map((collection) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      itemCount: collection.itemCount,
      typeCount: collection.typeCount,
      dominantTypeColor: collection.dominantTypeColor,
      types: collection.types,
    }));
}

export async function getRecentSidebarCollections(
  limit = 3,
): Promise<DashboardSidebarCollection[]> {
  const collections = await getRecentDashboardCollections(limit);

  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    itemCount: collection.itemCount,
    dominantTypeColor: collection.dominantTypeColor,
  }));
}

export async function getFavoriteSidebarCollections(
  limit = 3,
): Promise<DashboardSidebarCollection[]> {
  const demoUser = await getDemoUser();

  if (!demoUser) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: {
      userId: demoUser.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      items: {
        select: {
          itemTypeId: true,
          itemType: {
            select: {
              color: true,
            },
          },
        },
      },
    },
  });

  return collections
    .map((collection) => {
      const typeCounts = new Map<string, { color: string; count: number }>();

      for (const item of collection.items) {
        const existingType = typeCounts.get(item.itemTypeId);

        if (existingType) {
          existingType.count += 1;
          continue;
        }

        typeCounts.set(item.itemTypeId, {
          color: item.itemType.color,
          count: 1,
        });
      }

      const dominantTypeColor = [...typeCounts.values()].sort((left, right) => {
        return right.count - left.count;
      })[0]?.color ?? "#27272a";

      return {
        id: collection.id,
        name: collection.name,
        description: collection.description ?? "No description yet.",
        itemCount: collection.items.length,
        dominantTypeColor,
      };
    })
    .sort((left, right) => {
      if (right.itemCount !== left.itemCount) {
        return right.itemCount - left.itemCount;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, limit);
}

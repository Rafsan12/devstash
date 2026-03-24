import "server-only";

import { db } from "@/lib/db";

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

function mapCollectionsById<T extends { id: string }>(collections: T[]) {
  return new Map(collections.map((collection) => [collection.id, collection]));
}

function buildCollectionTypeSummaries(
  items: Array<{
    itemTypeId: string;
    itemType: {
      id: string;
      icon: string;
      color: string;
    };
  }>,
) {
  const typeMap = new Map<string, DashboardCollectionTypeSummary>();

  for (const item of items) {
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

  return [...typeMap.values()].sort(compareTypeSummaries);
}

export async function getRecentDashboardCollections(
  userId: string | null,
  limit = 6,
): Promise<DashboardRecentCollection[]> {
  if (!userId) {
    return [];
  }

  const recentCollectionActivity = await db.item.groupBy({
    by: ["collectionId"],
    where: {
      userId,
    },
    _max: {
      updatedAt: true,
    },
    orderBy: {
      _max: {
        updatedAt: "desc",
      },
    },
    take: limit,
  });

  const recentCollectionIds = recentCollectionActivity.map((entry) => entry.collectionId);
  const remainingSlots = limit - recentCollectionIds.length;

  const emptyCollections = remainingSlots > 0
    ? await db.collection.findMany({
        where: {
          userId,
          id: {
            notIn: recentCollectionIds,
          },
          items: {
            none: {},
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: remainingSlots,
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
        },
      })
    : [];

  const selectedCollectionIds = [
    ...recentCollectionIds,
    ...emptyCollections.map((collection) => collection.id),
  ];

  if (selectedCollectionIds.length === 0) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: {
      id: {
        in: selectedCollectionIds,
      },
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

  const collectionsById = mapCollectionsById(collections);
  const recentActivityById = new Map(
    recentCollectionActivity.map((entry) => [entry.collectionId, entry._max.updatedAt]),
  );

  return selectedCollectionIds
    .map<DashboardRecentCollectionWithActivity | null>((collectionId) => {
      const collection = collectionsById.get(collectionId);

      if (!collection) {
        return null;
      }

      const types = buildCollectionTypeSummaries(collection.items);
      const fallbackLastActivityAt = recentActivityById.get(collection.id) ?? collection.createdAt;

      return {
        id: collection.id,
        name: collection.name,
        description: collection.description ?? "No description yet.",
        itemCount: collection.items.length,
        typeCount: types.length,
        dominantTypeColor: types[0]?.color ?? "#27272a",
        types,
        lastActivityAt: fallbackLastActivityAt,
      };
    })
    .filter((collection): collection is DashboardRecentCollectionWithActivity => collection !== null)
    .sort((left, right) => right.lastActivityAt.getTime() - left.lastActivityAt.getTime())
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
  userId: string | null,
  limit = 3,
): Promise<DashboardSidebarCollection[]> {
  const collections = await getRecentDashboardCollections(userId, limit);

  return collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    itemCount: collection.itemCount,
    dominantTypeColor: collection.dominantTypeColor,
  }));
}

export async function getFavoriteSidebarCollections(
  userId: string | null,
  limit = 3,
): Promise<DashboardSidebarCollection[]> {
  if (!userId) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: {
      userId,
    },
    take: limit,
    orderBy: [
      {
        items: {
          _count: "desc",
        },
      },
      {
        name: "asc",
      },
    ],
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  if (collections.length === 0) {
    return [];
  }

  const favoriteCollectionIds = collections.map((collection) => collection.id);
  const items = await db.item.findMany({
    where: {
      userId,
      collectionId: {
        in: favoriteCollectionIds,
      },
    },
    select: {
      collectionId: true,
      itemTypeId: true,
      itemType: {
        select: {
          color: true,
        },
      },
    },
  });

  const typeCountsByCollection = new Map<string, Map<string, { color: string; count: number }>>();

  for (const item of items) {
    const collectionTypeCounts =
      typeCountsByCollection.get(item.collectionId) ?? new Map<string, { color: string; count: number }>();
    const existingType = collectionTypeCounts.get(item.itemTypeId);

    if (existingType) {
      existingType.count += 1;
    } else {
      collectionTypeCounts.set(item.itemTypeId, {
        color: item.itemType.color,
        count: 1,
      });
    }

    typeCountsByCollection.set(item.collectionId, collectionTypeCounts);
  }

  return collections.map((collection) => {
    const dominantTypeColor = [...(typeCountsByCollection.get(collection.id)?.values() ?? [])]
      .sort((left, right) => right.count - left.count)[0]?.color ?? "#27272a";

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "No description yet.",
      itemCount: collection._count.items,
      dominantTypeColor,
    };
  });
}

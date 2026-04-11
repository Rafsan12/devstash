import "server-only";

import { db } from "@/lib/db";

const DEFAULT_COLLECTION_NAME = "General";
const DEFAULT_COLLECTION_DESCRIPTION = "Your starter collection for notes, snippets, and links.";

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

type GroupedCollectionTypeCount = {
  collectionId: string;
  itemTypeId: string;
  count: number;
  icon: string;
  color: string;
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

function buildCollectionTypeSummaries(items: GroupedCollectionTypeCount[]) {
  return items
    .map((item) => ({
      id: item.itemTypeId,
      icon: item.icon,
      color: item.color,
      count: item.count,
    }))
    .sort(compareTypeSummaries);
}

async function getCollectionTypeCounts(
  userId: string,
  collectionIds: string[],
): Promise<Map<string, GroupedCollectionTypeCount[]>> {
  if (collectionIds.length === 0) {
    return new Map();
  }

  const groupedCounts = await db.item.groupBy({
    by: ["collectionId", "itemTypeId"],
    where: {
      userId,
      collectionId: {
        in: collectionIds,
      },
    },
    _count: {
      itemTypeId: true,
    },
  });

  const itemTypeIds = [...new Set(groupedCounts.map((entry) => entry.itemTypeId))];
  const itemTypes = itemTypeIds.length > 0
    ? await db.itemType.findMany({
        where: {
          id: {
            in: itemTypeIds,
          },
        },
        select: {
          id: true,
          icon: true,
          color: true,
        },
      })
    : [];
  const itemTypesById = new Map(itemTypes.map((itemType) => [itemType.id, itemType]));
  const countsByCollection = new Map<string, GroupedCollectionTypeCount[]>();

  for (const entry of groupedCounts) {
    const itemType = itemTypesById.get(entry.itemTypeId);

    if (!itemType) {
      continue;
    }

    const collectionCounts = countsByCollection.get(entry.collectionId) ?? [];
    collectionCounts.push({
      collectionId: entry.collectionId,
      itemTypeId: entry.itemTypeId,
      count: entry._count.itemTypeId,
      icon: itemType.icon,
      color: itemType.color,
    });
    countsByCollection.set(entry.collectionId, collectionCounts);
  }

  return countsByCollection;
}

export type CollectionDetail = {
  id: string;
  name: string;
  description: string;
};

export async function getCollectionById(
  userId: string | null,
  collectionId: string,
): Promise<CollectionDetail | null> {
  if (!userId) {
    return null;
  }

  const collection = await db.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (!collection) {
    return null;
  }

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? "No description yet.",
  };
}

export async function getAllDashboardCollections(
  userId: string | null,
): Promise<DashboardRecentCollection[]> {
  if (!userId) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (collections.length === 0) {
    return [];
  }

  const collectionIds = collections.map((c) => c.id);

  const [collectionTotals, collectionTypeCounts] = await Promise.all([
    db.item.groupBy({
      by: ["collectionId"],
      where: { userId, collectionId: { in: collectionIds } },
      _count: { _all: true },
    }),
    getCollectionTypeCounts(userId, collectionIds),
  ]);

  const collectionTotalsById = new Map(
    collectionTotals.map((entry) => [entry.collectionId, entry._count._all]),
  );

  return collections.map((collection) => {
    const types = buildCollectionTypeSummaries(
      collectionTypeCounts.get(collection.id) ?? [],
    );

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "No description yet.",
      itemCount: collectionTotalsById.get(collection.id) ?? 0,
      typeCount: types.length,
      dominantTypeColor: types[0]?.color ?? "#27272a",
      types,
    };
  });
}

export async function ensureStarterCollection(userId: string | null) {
  if (!userId) {
    return null;
  }

  const existingCollection = await db.collection.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (existingCollection) {
    return existingCollection;
  }

  return db.collection.create({
    data: {
      name: DEFAULT_COLLECTION_NAME,
      description: DEFAULT_COLLECTION_DESCRIPTION,
      userId,
    },
    select: {
      id: true,
    },
  });
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

  const [collections, collectionTotals, collectionTypeCounts] = await Promise.all([
    db.collection.findMany({
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
      },
    }),
    db.item.groupBy({
      by: ["collectionId"],
      where: {
        userId,
        collectionId: {
          in: selectedCollectionIds,
        },
      },
      _count: {
        _all: true,
      },
    }),
    getCollectionTypeCounts(userId, selectedCollectionIds),
  ]);

  const collectionsById = mapCollectionsById(collections);
  const recentActivityById = new Map(
    recentCollectionActivity.map((entry) => [entry.collectionId, entry._max.updatedAt]),
  );
  const collectionTotalsById = new Map(
    collectionTotals.map((entry) => [entry.collectionId, entry._count._all]),
  );

  return selectedCollectionIds
    .map<DashboardRecentCollectionWithActivity | null>((collectionId) => {
      const collection = collectionsById.get(collectionId);

      if (!collection) {
        return null;
      }

      const types = buildCollectionTypeSummaries(collectionTypeCounts.get(collection.id) ?? []);
      const fallbackLastActivityAt = recentActivityById.get(collection.id) ?? collection.createdAt;

      return {
        id: collection.id,
        name: collection.name,
        description: collection.description ?? "No description yet.",
        itemCount: collectionTotalsById.get(collection.id) ?? 0,
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
  const typeCountsByCollection = await getCollectionTypeCounts(userId, favoriteCollectionIds);

  return collections.map((collection) => {
    const dominantTypeColor = buildCollectionTypeSummaries(
      typeCountsByCollection.get(collection.id) ?? [],
    )[0]?.color ?? "#27272a";

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "No description yet.",
      itemCount: collection._count.items,
      dominantTypeColor,
    };
  });
}

export async function createCollection(
  userId: string,
  data: { name: string; description?: string },
) {
  return db.collection.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
}

export async function updateCollection(
  userId: string,
  collectionId: string,
  data: { name: string; description?: string },
) {
  const existing = await db.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true },
  });

  if (!existing) return null;

  return db.collection.update({
    where: { id: existing.id },
    data: {
      name: data.name,
      description: data.description ?? null,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
}

export async function deleteCollection(userId: string, collectionId: string) {
  const collection = await db.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true },
  });

  if (!collection) return false;

  // Find another collection to move items to (items must not be deleted)
  const otherCollection = await db.collection.findFirst({
    where: { userId, id: { not: collectionId } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  let targetCollectionId: string;

  if (otherCollection) {
    targetCollectionId = otherCollection.id;
  } else {
    // No other collection — create a General collection to receive the items
    const general = await db.collection.create({
      data: {
        name: DEFAULT_COLLECTION_NAME,
        description: DEFAULT_COLLECTION_DESCRIPTION,
        userId,
      },
      select: { id: true },
    });
    targetCollectionId = general.id;
  }

  // Move items to the target collection before deleting
  await db.item.updateMany({
    where: { collectionId, userId },
    data: { collectionId: targetCollectionId },
  });

  await db.collection.delete({ where: { id: collectionId } });

  return true;
}

export async function getAllCollections(userId: string | null): Promise<DashboardSidebarCollection[]> {
  if (!userId) {
    return [];
  }

  const collections = await db.collection.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
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

  const collectionIds = collections.map((collection) => collection.id);
  const typeCountsByCollection = await getCollectionTypeCounts(userId, collectionIds);

  return collections.map((collection) => {
    const dominantTypeColor = buildCollectionTypeSummaries(
      typeCountsByCollection.get(collection.id) ?? [],
    )[0]?.color ?? "#27272a";

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "No description yet.",
      itemCount: collection._count.items,
      dominantTypeColor,
    };
  });
}

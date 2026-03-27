import "server-only";

import { db } from "@/lib/db";
import { DEMO_USER_EMAIL, type DashboardUserRecord } from "@/lib/db/dashboard-user";

type DashboardItemTypeSummary = {
  id: string;
  icon: string;
  color: string;
};

export type DashboardItemCardData = {
  id: string;
  title: string;
  description: string;
  itemTypeId: string;
  itemType: DashboardItemTypeSummary;
  tags: string[];
  isPinned: boolean;
};

export type DashboardStats = {
  totalItems: number;
  totalCollections: number;
  pinnedItems: number;
  recentItems: number;
};

export type DashboardSidebarItemType = {
  id: string;
  name: string;
  icon: string;
  count: number;
  href: string;
};

export type DashboardSidebarUser = {
  name: string;
  email: string;
  image: string | null;
};

const itemTypeRouteMap: Record<string, string> = {
  snippet: "snippets",
  prompt: "prompts",
  command: "commands",
  note: "notes",
  file: "files",
  image: "images",
  link: "links",
};

const itemTypeLabelMap: Record<string, string> = {
  snippet: "Snippets",
  prompt: "Prompts",
  command: "Commands",
  note: "Notes",
  file: "Files",
  image: "Images",
  link: "Links",
};

const itemTypeSortOrder: Record<string, number> = {
  snippet: 0,
  prompt: 1,
  command: 2,
  note: 3,
  file: 4,
  image: 5,
  link: 6,
};

function createItemDescription(content: string) {
  const normalizedContent = content.replace(/\s+/g, " ").trim();

  if (!normalizedContent) {
    return "No content yet.";
  }

  return normalizedContent;
}

function createItemTags(itemTypeId: string, fileExtension: string, collectionName: string) {
  return [itemTypeId, fileExtension, collectionName].filter(Boolean);
}

function mapDashboardItem(item: {
  id: string;
  title: string;
  content: string;
  itemTypeId: string;
  fileExtension: string;
  isPinned: boolean;
  collection: {
    name: string;
  };
  itemType: DashboardItemTypeSummary;
}): DashboardItemCardData {
  return {
    id: item.id,
    title: item.title,
    description: createItemDescription(item.content),
    itemTypeId: item.itemTypeId,
    itemType: item.itemType,
    tags: createItemTags(item.itemTypeId, item.fileExtension, item.collection.name),
    isPinned: item.isPinned,
  };
}

export async function getPinnedDashboardItems(userId: string | null): Promise<DashboardItemCardData[]> {
  if (!userId) {
    return [];
  }

  const items = await db.item.findMany({
    where: {
      userId,
      isPinned: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        title: "asc",
      },
    ],
    select: {
      id: true,
      title: true,
      content: true,
      itemTypeId: true,
      fileExtension: true,
      isPinned: true,
      collection: {
        select: {
          name: true,
        },
      },
      itemType: {
        select: {
          id: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  return items.map(mapDashboardItem);
}

export async function getRecentDashboardItems(
  userId: string | null,
  limit = 10,
): Promise<DashboardItemCardData[]> {
  if (!userId) {
    return [];
  }

  const recentItems = await db.recentItem.findMany({
    where: {
      userId,
    },
    take: limit,
    orderBy: {
      visitedAt: "desc",
    },
    select: {
      item: {
        select: {
          id: true,
          title: true,
          content: true,
          itemTypeId: true,
          fileExtension: true,
          isPinned: true,
          collection: {
            select: {
              name: true,
            },
          },
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

  return recentItems.map((recentItem) => mapDashboardItem(recentItem.item));
}

export async function getDashboardStats(userId: string | null): Promise<DashboardStats> {
  if (!userId) {
    return {
      totalItems: 0,
      totalCollections: 0,
      pinnedItems: 0,
      recentItems: 0,
    };
  }

  const [totalItems, totalCollections, pinnedItems, recentItems] = await Promise.all([
    db.item.count({
      where: {
        userId,
      },
    }),
    db.collection.count({
      where: {
        userId,
      },
    }),
    db.item.count({
      where: {
        userId,
        isPinned: true,
      },
    }),
    db.recentItem.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    totalItems,
    totalCollections,
    pinnedItems,
    recentItems,
  };
}

export async function getDashboardSidebarItemTypes(
  userId: string | null,
): Promise<DashboardSidebarItemType[]> {
  if (!userId) {
    return [];
  }

  const [systemItemTypes, itemCounts] = await Promise.all([
    db.itemType.findMany({
      where: {
        isSystem: true,
      },
      select: {
        id: true,
        icon: true,
      },
    }),
    db.item.groupBy({
      by: ["itemTypeId"],
      where: {
        userId,
      },
      _count: {
        itemTypeId: true,
      },
    }),
  ]);

  const countMap = new Map(
    itemCounts.map((item) => [item.itemTypeId, item._count.itemTypeId]),
  );

  return systemItemTypes
    .map((itemType) => ({
      id: itemType.id,
      name: itemTypeLabelMap[itemType.id] ?? itemType.id,
      icon: itemType.icon,
      count: countMap.get(itemType.id) ?? 0,
      href: `/items/${itemTypeRouteMap[itemType.id] ?? itemType.id}`,
    }))
    .sort((left, right) => {
      const leftOrder = itemTypeSortOrder[left.id] ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = itemTypeSortOrder[right.id] ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.name.localeCompare(right.name);
    });
}

export function getDashboardSidebarUser(
  user: DashboardUserRecord | null,
): DashboardSidebarUser | null {
  if (!user) {
    return null;
  }

  const displayName = user.name ?? "Demo User";

  return {
    name: displayName,
    email: user.email ?? DEMO_USER_EMAIL,
    image: user.image,
  };
}

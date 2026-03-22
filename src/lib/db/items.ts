import "server-only";

import { db } from "@/lib/db";

const DEMO_USER_EMAIL = "demo@devstash.io";

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

export async function getPinnedDashboardItems(): Promise<DashboardItemCardData[]> {
  const demoUser = await getDemoUser();

  if (!demoUser) {
    return [];
  }

  const items = await db.item.findMany({
    where: {
      userId: demoUser.id,
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
  limit = 10,
): Promise<DashboardItemCardData[]> {
  const demoUser = await getDemoUser();

  if (!demoUser) {
    return [];
  }

  const recentItems = await db.recentItem.findMany({
    where: {
      userId: demoUser.id,
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

export async function getDashboardStats(): Promise<DashboardStats> {
  const demoUser = await getDemoUser();

  if (!demoUser) {
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
        userId: demoUser.id,
      },
    }),
    db.collection.count({
      where: {
        userId: demoUser.id,
      },
    }),
    db.item.count({
      where: {
        userId: demoUser.id,
        isPinned: true,
      },
    }),
    db.recentItem.count({
      where: {
        userId: demoUser.id,
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

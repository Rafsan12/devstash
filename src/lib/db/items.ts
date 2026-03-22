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
  avatarLabel: string;
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

export async function getDashboardSidebarItemTypes(): Promise<DashboardSidebarItemType[]> {
  const demoUser = await getDemoUser();

  if (!demoUser) {
    return [];
  }

  const [systemItemTypes, items] = await Promise.all([
    db.itemType.findMany({
      where: {
        isSystem: true,
      },
      select: {
        id: true,
        icon: true,
      },
    }),
    db.item.findMany({
      where: {
        userId: demoUser.id,
      },
      select: {
        itemTypeId: true,
      },
    }),
  ]);

  const countMap = new Map<string, number>();

  for (const item of items) {
    countMap.set(item.itemTypeId, (countMap.get(item.itemTypeId) ?? 0) + 1);
  }

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

export async function getDashboardSidebarUser(): Promise<DashboardSidebarUser | null> {
  const demoUser = await db.user.findUnique({
    where: {
      email: DEMO_USER_EMAIL,
    },
    select: {
      name: true,
      email: true,
    },
  });

  if (!demoUser) {
    return null;
  }

  const displayName = demoUser.name ?? "Demo User";
  const avatarLabel = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    name: displayName,
    email: demoUser.email ?? DEMO_USER_EMAIL,
    avatarLabel: avatarLabel || "DU",
  };
}

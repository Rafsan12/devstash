import "server-only";

import { Prisma } from "@/generated/prisma/client/client";
import { db } from "@/lib/db";
import { DEMO_USER_EMAIL, type DashboardUserRecord } from "@/lib/db/dashboard-user";
import {
  COLLECTIONS_PER_PAGE,
  DASHBOARD_RECENT_ITEMS_LIMIT,
  ITEMS_PER_PAGE,
  getPagination,
} from "@/lib/pagination";

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

export type PaginatedDashboardItems = {
  items: DashboardItemCardData[];
  page: number;
  totalCount: number;
  totalPages: number;
};

export type ItemDetail = {
  id: string;
  title: string;
  content: string;
  itemTypeId: string;
  fileExtension: string;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  itemType: {
    id: string;
    icon: string;
    color: string;
  };
  collection: {
    id: string;
    name: string;
  };
  tags: string[];
};

function mapItemDetail(item: {
  id: string;
  title: string;
  content: string;
  itemTypeId: string;
  fileExtension: string;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  itemType: {
    id: string;
    icon: string;
    color: string;
  };
  collection: {
    id: string;
    name: string;
  };
}): ItemDetail {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    itemTypeId: item.itemTypeId,
    fileExtension: item.fileExtension,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    itemType: item.itemType,
    collection: item.collection,
    tags: [item.itemTypeId, item.fileExtension, item.collection.name].filter(Boolean),
  };
}

export async function getItemById(
  userId: string,
  itemId: string,
): Promise<ItemDetail | null> {
  const item = await db.item.findFirst({
    where: {
      id: itemId,
      userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      itemTypeId: true,
      fileExtension: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      itemType: {
        select: {
          id: true,
          icon: true,
          color: true,
        },
      },
      collection: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return mapItemDetail(item);
}

export async function toggleItemPinned(
  userId: string,
  itemId: string,
): Promise<ItemDetail | null> {
  const existingItem = await db.item.findFirst({
    where: {
      id: itemId,
      userId,
    },
    select: {
      id: true,
      isPinned: true,
    },
  });

  if (!existingItem) {
    return null;
  }

  const updatedItem = await db.item.update({
    where: {
      id: existingItem.id,
    },
    data: {
      isPinned: !existingItem.isPinned,
    },
    select: {
      id: true,
      title: true,
      content: true,
      itemTypeId: true,
      fileExtension: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      itemType: {
        select: {
          id: true,
          icon: true,
          color: true,
        },
      },
      collection: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return mapItemDetail(updatedItem);
}

export async function deleteItemById(userId: string, itemId: string): Promise<boolean> {
  const deleted = await db.item.deleteMany({
    where: {
      id: itemId,
      userId,
    },
  });

  return deleted.count > 0;
}

export type UpdateItemData = {
  title: string;
  content: string;
  fileExtension: string;
  collectionId?: string;
};

export type CreateItemData = {
  title: string;
  content: string;
  itemTypeId: string;
  collectionId: string;
  fileExtension?: string;
};

export async function createItem(userId: string, data: CreateItemData): Promise<ItemDetail> {
  const item = await db.item.create({
    data: {
      userId,
      title: data.title,
      content: data.content,
      itemTypeId: data.itemTypeId,
      collectionId: data.collectionId,
      fileExtension: data.fileExtension ?? "",
    },
    select: {
      id: true,
      title: true,
      content: true,
      itemTypeId: true,
      fileExtension: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      itemType: {
        select: {
          id: true,
          icon: true,
          color: true,
        },
      },
      collection: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return mapItemDetail(item);
}

export async function updateItemById(
  userId: string,
  itemId: string,
  data: UpdateItemData,
): Promise<ItemDetail | null> {
  const existing = await db.item.findFirst({
    where: {
      id: itemId,
      userId,
    },
    select: { id: true },
  });

  if (!existing) {
    return null;
  }

  const updatedItem = await db.item.update({
    where: { id: existing.id },
    data: {
      title: data.title,
      content: data.content,
      fileExtension: data.fileExtension,
      ...(data.collectionId ? { collectionId: data.collectionId } : {}),
    },
    select: {
      id: true,
      title: true,
      content: true,
      itemTypeId: true,
      fileExtension: true,
      isFavorite: true,
      isPinned: true,
      createdAt: true,
      updatedAt: true,
      itemType: {
        select: {
          id: true,
          icon: true,
          color: true,
        },
      },
      collection: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return mapItemDetail(updatedItem);
}

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

const DASHBOARD_ITEM_PREVIEW_LENGTH = 180;

type DashboardItemQueryRow = {
  id: string;
  title: string;
  description: string | null;
  itemTypeId: string;
  fileExtension: string;
  isPinned: boolean;
  collectionName: string;
  itemTypeIcon: string;
  itemTypeColor: string;
};

function createItemDescription(contentPreview: string | null) {
  const normalizedContent = (contentPreview ?? "").replace(/\s+/g, " ").trim();

  if (!normalizedContent) {
    return "No content yet.";
  }

  if (normalizedContent.length > DASHBOARD_ITEM_PREVIEW_LENGTH) {
    return `${normalizedContent.slice(0, DASHBOARD_ITEM_PREVIEW_LENGTH).trimEnd()}...`;
  }

  return normalizedContent;
}

function createItemTags(itemTypeId: string, fileExtension: string, collectionName: string) {
  return [itemTypeId, fileExtension, collectionName].filter(Boolean);
}

function mapDashboardItem(item: DashboardItemQueryRow): DashboardItemCardData {
  return {
    id: item.id,
    title: item.title,
    description: createItemDescription(item.description),
    itemTypeId: item.itemTypeId,
    itemType: {
      id: item.itemTypeId,
      icon: item.itemTypeIcon,
      color: item.itemTypeColor,
    },
    tags: createItemTags(item.itemTypeId, item.fileExtension, item.collectionName),
    isPinned: item.isPinned,
  };
}

export function getItemTypeIdFromRoute(route: string): string | null {
  const entry = Object.entries(itemTypeRouteMap).find(([, r]) => r === route);
  return entry ? entry[0] : null;
}

export async function getDashboardItemsByType(
  userId: string | null,
  itemTypeId: string,
  page = 1,
): Promise<PaginatedDashboardItems> {
  if (!userId) {
    return {
      items: [],
      page: 1,
      totalCount: 0,
      totalPages: 0,
    };
  }

  const totalCount = await db.item.count({
    where: {
      userId,
      itemTypeId,
    },
  });
  const pagination = getPagination({
    page,
    pageSize: COLLECTIONS_PER_PAGE,
    totalCount,
  });

  const items = await db.$queryRaw<DashboardItemQueryRow[]>(Prisma.sql`
    SELECT
      item.id,
      item.title,
      LEFT(TRIM(REGEXP_REPLACE(item.content, '\s+', ' ', 'g')), ${DASHBOARD_ITEM_PREVIEW_LENGTH + 1}) AS description,
      item."itemTypeId",
      item."fileExtension",
      item."isPinned",
      collection.name AS "collectionName",
      item_type.icon AS "itemTypeIcon",
      item_type.color AS "itemTypeColor"
    FROM "Item" AS item
    INNER JOIN "Collection" AS collection ON collection.id = item."collectionId"
    INNER JOIN "ItemType" AS item_type ON item_type.id = item."itemTypeId"
    WHERE item."userId" = ${userId}
      AND item."itemTypeId" = ${itemTypeId}
    ORDER BY item."isPinned" DESC, item."updatedAt" DESC, item.title ASC
    LIMIT ${pagination.take}
    OFFSET ${pagination.skip}
  `);

  return {
    items: items.map(mapDashboardItem),
    page: pagination.page,
    totalCount,
    totalPages: pagination.totalPages,
  };
}

export async function getPinnedDashboardItems(userId: string | null): Promise<DashboardItemCardData[]> {
  if (!userId) {
    return [];
  }

  const items = await db.$queryRaw<DashboardItemQueryRow[]>(Prisma.sql`
    SELECT
      item.id,
      item.title,
      LEFT(TRIM(REGEXP_REPLACE(item.content, '\s+', ' ', 'g')), ${DASHBOARD_ITEM_PREVIEW_LENGTH + 1}) AS description,
      item."itemTypeId",
      item."fileExtension",
      item."isPinned",
      collection.name AS "collectionName",
      item_type.icon AS "itemTypeIcon",
      item_type.color AS "itemTypeColor"
    FROM "Item" AS item
    INNER JOIN "Collection" AS collection ON collection.id = item."collectionId"
    INNER JOIN "ItemType" AS item_type ON item_type.id = item."itemTypeId"
    WHERE item."userId" = ${userId}
      AND item."isPinned" = true
    ORDER BY item."updatedAt" DESC, item.title ASC
  `);

  return items.map(mapDashboardItem);
}

export async function getRecentDashboardItems(
  userId: string | null,
  limit = DASHBOARD_RECENT_ITEMS_LIMIT,
): Promise<DashboardItemCardData[]> {
  if (!userId) {
    return [];
  }

  const recentItems = await db.$queryRaw<DashboardItemQueryRow[]>(Prisma.sql`
    SELECT
      item.id,
      item.title,
      LEFT(TRIM(REGEXP_REPLACE(item.content, '\s+', ' ', 'g')), ${DASHBOARD_ITEM_PREVIEW_LENGTH + 1}) AS description,
      item."itemTypeId",
      item."fileExtension",
      item."isPinned",
      collection.name AS "collectionName",
      item_type.icon AS "itemTypeIcon",
      item_type.color AS "itemTypeColor"
    FROM "RecentItem" AS recent_item
    INNER JOIN "Item" AS item ON item.id = recent_item."itemId"
    INNER JOIN "Collection" AS collection ON collection.id = item."collectionId"
    INNER JOIN "ItemType" AS item_type ON item_type.id = item."itemTypeId"
    WHERE recent_item."userId" = ${userId}
    ORDER BY recent_item."visitedAt" DESC
    LIMIT ${limit}
  `);

  return recentItems.map(mapDashboardItem);
}

export async function getDashboardItemsByCollection(
  userId: string | null,
  collectionId: string,
  page = 1,
): Promise<PaginatedDashboardItems> {
  if (!userId) {
    return {
      items: [],
      page: 1,
      totalCount: 0,
      totalPages: 0,
    };
  }

  const totalCount = await db.item.count({
    where: {
      userId,
      collectionId,
    },
  });
  const pagination = getPagination({
    page,
    pageSize: ITEMS_PER_PAGE,
    totalCount,
  });

  const items = await db.$queryRaw<DashboardItemQueryRow[]>(Prisma.sql`
    SELECT
      item.id,
      item.title,
      LEFT(TRIM(REGEXP_REPLACE(item.content, '\s+', ' ', 'g')), ${DASHBOARD_ITEM_PREVIEW_LENGTH + 1}) AS description,
      item."itemTypeId",
      item."fileExtension",
      item."isPinned",
      collection.name AS "collectionName",
      item_type.icon AS "itemTypeIcon",
      item_type.color AS "itemTypeColor"
    FROM "Item" AS item
    INNER JOIN "Collection" AS collection ON collection.id = item."collectionId"
    INNER JOIN "ItemType" AS item_type ON item_type.id = item."itemTypeId"
    WHERE item."userId" = ${userId}
      AND item."collectionId" = ${collectionId}
    ORDER BY item."isPinned" DESC, item."updatedAt" DESC, item.title ASC
    LIMIT ${pagination.take}
    OFFSET ${pagination.skip}
  `);

  return {
    items: items.map(mapDashboardItem),
    page: pagination.page,
    totalCount,
    totalPages: pagination.totalPages,
  };
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

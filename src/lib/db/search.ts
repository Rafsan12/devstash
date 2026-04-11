import "server-only";

import { db } from "@/lib/db";

const SEARCH_CONTENT_PREVIEW_LENGTH = 120;

export type SearchItem = {
  id: string;
  title: string;
  typeId: string;
  typeIcon: string;
  contentPreview: string;
  collectionName: string;
};

export type SearchCollection = {
  id: string;
  name: string;
  itemCount: number;
};

export type SearchData = {
  items: SearchItem[];
  collections: SearchCollection[];
};

export async function getSearchData(userId: string | null): Promise<SearchData> {
  if (!userId) {
    return { items: [], collections: [] };
  }

  const [items, collections] = await Promise.all([
    db.item.findMany({
      where: { userId },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        content: true,
        itemTypeId: true,
        itemType: { select: { icon: true } },
        collection: { select: { name: true } },
      },
    }),
    db.collection.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        _count: { select: { items: true } },
      },
    }),
  ]);

  return {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      typeId: item.itemTypeId,
      typeIcon: item.itemType.icon,
      contentPreview: item.content
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, SEARCH_CONTENT_PREVIEW_LENGTH),
      collectionName: item.collection.name,
    })),
    collections: collections.map((col) => ({
      id: col.id,
      name: col.name,
      itemCount: col._count.items,
    })),
  };
}

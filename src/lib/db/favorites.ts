import "server-only";

import { db } from "@/lib/db";

export type FavoriteItem = {
  id: string;
  title: string;
  itemTypeId: string;
  itemType: { id: string; icon: string; color: string };
  fileExtension: string;
  updatedAt: string;
};

export type FavoriteCollection = {
  id: string;
  name: string;
  updatedAt: string;
};

export async function getFavoriteItems(userId: string | null): Promise<FavoriteItem[]> {
  if (!userId) return [];

  const items = await db.item.findMany({
    where: { userId, isFavorite: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      itemTypeId: true,
      fileExtension: true,
      updatedAt: true,
      itemType: { select: { id: true, icon: true, color: true } },
    },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    itemTypeId: item.itemTypeId,
    itemType: item.itemType,
    fileExtension: item.fileExtension,
    updatedAt: item.updatedAt.toISOString(),
  }));
}

export async function getFavoriteCollections(
  userId: string | null,
): Promise<FavoriteCollection[]> {
  if (!userId) return [];

  const collections = await db.collection.findMany({
    where: { userId, isFavorite: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    updatedAt: c.createdAt.toISOString(),
  }));
}

export async function toggleItemFavorite(
  userId: string,
  itemId: string,
): Promise<{ isFavorite: boolean } | null> {
  const existing = await db.item.findFirst({
    where: { id: itemId, userId },
    select: { id: true, isFavorite: true },
  });

  if (!existing) return null;

  const updated = await db.item.update({
    where: { id: existing.id },
    data: { isFavorite: !existing.isFavorite },
    select: { isFavorite: true },
  });

  return { isFavorite: updated.isFavorite };
}

export async function toggleCollectionFavorite(
  userId: string,
  collectionId: string,
): Promise<{ isFavorite: boolean } | null> {
  const existing = await db.collection.findFirst({
    where: { id: collectionId, userId },
    select: { id: true, isFavorite: true },
  });

  if (!existing) return null;

  const updated = await db.collection.update({
    where: { id: existing.id },
    data: { isFavorite: !existing.isFavorite },
    select: { isFavorite: true },
  });

  return { isFavorite: updated.isFavorite };
}

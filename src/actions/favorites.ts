"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { toggleItemFavorite, toggleCollectionFavorite } from "@/lib/db/favorites";

export async function toggleItemFavoriteAction(itemId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  try {
    const result = await toggleItemFavorite(userId, itemId);

    if (!result) {
      return { success: false as const, error: "Item not found." };
    }

    revalidatePath("/favorites");
    revalidatePath("/dashboard");

    return { success: true as const, data: result };
  } catch (error) {
    console.error("[toggleItemFavoriteAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

export async function toggleCollectionFavoriteAction(collectionId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  try {
    const result = await toggleCollectionFavorite(userId, collectionId);

    if (!result) {
      return { success: false as const, error: "Collection not found." };
    }

    revalidatePath("/favorites");
    revalidatePath("/dashboard");
    revalidatePath("/collections");

    return { success: true as const, data: result };
  } catch (error) {
    console.error("[toggleCollectionFavoriteAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

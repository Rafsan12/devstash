"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { createItem, deleteItemById, updateItemById } from "@/lib/db/items";

const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().optional().default(""),
  fileExtension: z.string().optional().default(""),
  collectionId: z.string().min(1, "Collection is required").optional(),
});

const createItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().optional().default(""),
  itemTypeId: z.string().min(1, "Item type is required"),
  collectionId: z.string().min(1, "Collection is required"),
  fileExtension: z.string().optional().default(""),
}).refine((data) => {
  if (data.itemTypeId === "link" && !data.content.trim()) {
    return false;
  }
  return true;
}, {
  message: "URL is required for links",
  path: ["content"],
});

export async function updateItem(itemId: string, formData: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  const parsed = updateItemSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Validation failed.";
    return { success: false as const, error: firstError };
  }

  try {
    const updatedItem = await updateItemById(userId, itemId, {
      title: parsed.data.title,
      content: parsed.data.content,
      fileExtension: parsed.data.fileExtension,
      collectionId: parsed.data.collectionId,
    });

    if (!updatedItem) {
      return { success: false as const, error: "Item not found." };
    }

    return { success: true as const, data: updatedItem };
  } catch (error) {
    console.error("[updateItem action error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

export async function deleteItem(itemId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  try {
    const deleted = await deleteItemById(userId, itemId);

    if (!deleted) {
      return { success: false as const, error: "Item not found." };
    }

    return { success: true as const };
  } catch (error) {
    console.error("[deleteItem action error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

export async function createItemAction(formData: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  const parsed = createItemSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Validation failed.";
    return { success: false as const, error: firstError };
  }

  try {
    const newItem = await createItem(userId, {
      title: parsed.data.title,
      content: parsed.data.content,
      itemTypeId: parsed.data.itemTypeId,
      collectionId: parsed.data.collectionId,
      fileExtension: parsed.data.fileExtension,
    });

    revalidatePath("/dashboard");
    revalidatePath("/items/[type]", "page");

    return { success: true as const, data: newItem };
  } catch (error) {
    console.error("[createItemAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

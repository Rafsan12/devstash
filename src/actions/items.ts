"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { deleteItemById, updateItemById } from "@/lib/db/items";

const updateItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().optional().default(""),
  fileExtension: z.string().optional().default(""),
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

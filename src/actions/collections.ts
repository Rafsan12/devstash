"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { createCollection, updateCollection, deleteCollection } from "@/lib/db/collections";

const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(300, "Description is too long").optional(),
});

export async function createCollectionAction(formData: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  const parsed = createCollectionSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Validation failed.";
    return { success: false as const, error: firstError };
  }

  try {
    const newCollection = await createCollection(userId, {
      name: parsed.data.name,
      description: parsed.data.description,
    });

    revalidatePath("/dashboard");

    return { success: true as const, data: newCollection };
  } catch (error) {
    console.error("[createCollectionAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

const updateCollectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(300, "Description is too long").optional(),
});

export async function updateCollectionAction(collectionId: string, formData: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  const parsed = updateCollectionSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Validation failed.";
    return { success: false as const, error: firstError };
  }

  try {
    const updated = await updateCollection(userId, collectionId, {
      name: parsed.data.name,
      description: parsed.data.description,
    });

    if (!updated) {
      return { success: false as const, error: "Collection not found." };
    }

    revalidatePath("/collections");
    revalidatePath(`/collections/${collectionId}`);
    revalidatePath("/dashboard");

    return { success: true as const, data: updated };
  } catch (error) {
    console.error("[updateCollectionAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  try {
    const deleted = await deleteCollection(userId, collectionId);

    if (!deleted) {
      return { success: false as const, error: "Collection not found." };
    }

    revalidatePath("/collections");
    revalidatePath("/dashboard");

    return { success: true as const };
  } catch (error) {
    console.error("[deleteCollectionAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

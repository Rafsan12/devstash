"use server";

import { auth } from "@/auth";
import { updateUserEditorPreferences } from "@/lib/db/editor-preferences";
import { updateEditorPreferencesSchema } from "@/lib/editor-preferences";

export async function updateEditorPreferencesAction(formData: unknown) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false as const, error: "Unauthorized." };
  }

  const parsed = updateEditorPreferencesSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0] ?? "Validation failed.";
    return { success: false as const, error: firstError };
  }

  try {
    const updatedPreferences = await updateUserEditorPreferences(userId, parsed.data);

    if (!updatedPreferences) {
      return { success: false as const, error: "User not found." };
    }

    return { success: true as const, data: updatedPreferences };
  } catch (error) {
    console.error("[updateEditorPreferencesAction error]", error);
    return { success: false as const, error: "Something went wrong." };
  }
}

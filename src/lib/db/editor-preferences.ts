import "server-only";

import { db } from "@/lib/db";
import {
  type EditorPreferences,
  normalizeEditorPreferences,
} from "@/lib/editor-preferences";

export async function getUserEditorPreferences(
  userId: string | null,
): Promise<EditorPreferences> {
  if (!userId) {
    return normalizeEditorPreferences(null);
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      editorPreferences: true,
    },
  });

  return normalizeEditorPreferences(user?.editorPreferences);
}

export async function updateUserEditorPreferences(
  userId: string,
  preferences: EditorPreferences,
): Promise<EditorPreferences | null> {
  const existingUser = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingUser) {
    return null;
  }

  const updatedUser = await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      editorPreferences: preferences,
    },
    select: {
      editorPreferences: true,
    },
  });

  return normalizeEditorPreferences(updatedUser.editorPreferences);
}

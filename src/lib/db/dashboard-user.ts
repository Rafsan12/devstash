import "server-only";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const DEMO_USER_EMAIL = "demo@devstash.io";

export type DashboardUserRecord = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  editorPreferences: unknown;
};

export async function getDemoDashboardUser(): Promise<DashboardUserRecord | null> {
  return db.user.findUnique({
    where: {
      email: DEMO_USER_EMAIL,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      editorPreferences: true,
    },
  });
}

export async function getAuthenticatedDashboardUser(): Promise<DashboardUserRecord | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      editorPreferences: true,
    },
  });
}

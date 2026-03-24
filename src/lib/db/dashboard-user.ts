import "server-only";

import { db } from "@/lib/db";

export const DEMO_USER_EMAIL = "demo@devstash.io";

export type DashboardUserRecord = {
  id: string;
  name: string | null;
  email: string | null;
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
    },
  });
}

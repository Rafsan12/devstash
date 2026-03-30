import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    item: {
      findFirst: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    collection: {
      count: vi.fn(),
    },
    recentItem: {
      count: vi.fn(),
    },
    itemType: {
      findMany: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

vi.mock("@/lib/db/dashboard-user", () => ({
  DEMO_USER_EMAIL: "demo@devstash.io",
}));

import {
  deleteItemById,
  getDashboardSidebarUser,
  getDashboardStats,
  getItemById,
  getItemTypeIdFromRoute,
  toggleItemPinned,
} from "./items";

const sampleDate = new Date("2026-03-30T10:00:00.000Z");

const sampleItemRecord = {
  id: "item-1",
  title: "Debug Prompt",
  content: "  First line\nSecond line  ",
  itemTypeId: "prompt",
  fileExtension: ".prompt",
  isPinned: false,
  createdAt: sampleDate,
  updatedAt: sampleDate,
  itemType: {
    id: "prompt",
    icon: "Sparkles",
    color: "#8b5cf6",
  },
  collection: {
    id: "collection-1",
    name: "AI Prompts",
  },
};

describe("items db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps item type routes back to ids", () => {
    expect(getItemTypeIdFromRoute("prompts")).toBe("prompt");
    expect(getItemTypeIdFromRoute("unknown")).toBeNull();
  });

  it("returns null from getItemById when no item exists", async () => {
    mockDb.item.findFirst.mockResolvedValueOnce(null);

    await expect(getItemById("user-1", "missing")).resolves.toBeNull();
    expect(mockDb.item.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "missing",
          userId: "user-1",
        },
      }),
    );
  });

  it("maps item detail records into the drawer shape", async () => {
    mockDb.item.findFirst.mockResolvedValueOnce(sampleItemRecord);

    await expect(getItemById("user-1", "item-1")).resolves.toEqual({
      id: "item-1",
      title: "Debug Prompt",
      content: "  First line\nSecond line  ",
      itemTypeId: "prompt",
      fileExtension: ".prompt",
      isPinned: false,
      createdAt: sampleDate.toISOString(),
      updatedAt: sampleDate.toISOString(),
      itemType: {
        id: "prompt",
        icon: "Sparkles",
        color: "#8b5cf6",
      },
      collection: {
        id: "collection-1",
        name: "AI Prompts",
      },
      tags: ["prompt", ".prompt", "AI Prompts"],
    });
  });

  it("returns null from toggleItemPinned when the item cannot be found", async () => {
    mockDb.item.findFirst.mockResolvedValueOnce(null);

    await expect(toggleItemPinned("user-1", "missing")).resolves.toBeNull();
    expect(mockDb.item.update).not.toHaveBeenCalled();
  });

  it("toggles the pin state and returns updated drawer data", async () => {
    mockDb.item.findFirst.mockResolvedValueOnce({
      id: "item-1",
      isPinned: false,
    });
    mockDb.item.update.mockResolvedValueOnce({
      ...sampleItemRecord,
      isPinned: true,
    });

    await expect(toggleItemPinned("user-1", "item-1")).resolves.toEqual(
      expect.objectContaining({
        id: "item-1",
        isPinned: true,
        tags: ["prompt", ".prompt", "AI Prompts"],
      }),
    );

    expect(mockDb.item.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "item-1" },
        data: { isPinned: true },
      }),
    );
  });

  it("returns whether deleteItemById removed any records", async () => {
    mockDb.item.deleteMany.mockResolvedValueOnce({ count: 1 });
    await expect(deleteItemById("user-1", "item-1")).resolves.toBe(true);

    mockDb.item.deleteMany.mockResolvedValueOnce({ count: 0 });
    await expect(deleteItemById("user-1", "missing")).resolves.toBe(false);
  });

  it("returns zeroed dashboard stats without a user id", async () => {
    await expect(getDashboardStats(null)).resolves.toEqual({
      totalItems: 0,
      totalCollections: 0,
      pinnedItems: 0,
      recentItems: 0,
    });

    expect(mockDb.item.count).not.toHaveBeenCalled();
  });

  it("builds a sidebar user with demo fallbacks", () => {
    expect(
      getDashboardSidebarUser({
        id: "user-1",
        name: null,
        email: null,
        image: null,
      }),
    ).toEqual({
      name: "Demo User",
      email: "demo@devstash.io",
      image: null,
    });
  });
});

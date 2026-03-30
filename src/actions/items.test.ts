import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

const mockDeleteItemById = vi.fn();
const mockUpdateItemById = vi.fn();
vi.mock("@/lib/db/items", () => ({
  deleteItemById: (...args: unknown[]) => mockDeleteItemById(...args),
  updateItemById: (...args: unknown[]) => mockUpdateItemById(...args),
}));

import { deleteItem, updateItem } from "./items";

const sampleItemDetail = {
  id: "item-1",
  title: "Updated Title",
  content: "New content",
  itemTypeId: "snippet",
  fileExtension: ".ts",
  isPinned: false,
  createdAt: "2026-03-30T10:00:00.000Z",
  updatedAt: "2026-03-30T10:00:00.000Z",
  itemType: { id: "snippet", icon: "Code", color: "#3b82f6" },
  collection: { id: "col-1", name: "TypeScript" },
  tags: ["snippet", ".ts", "TypeScript"],
};

describe("updateItem server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when user is not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const result = await updateItem("item-1", {
      title: "Updated",
      content: "New content",
      fileExtension: ".ts",
    });

    expect(result).toEqual({ success: false, error: "Unauthorized." });
    expect(mockUpdateItemById).not.toHaveBeenCalled();
  });

  it("returns validation error when title is empty", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const result = await updateItem("item-1", {
      title: "   ",
      content: "content",
      fileExtension: ".ts",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Title is required");
    expect(mockUpdateItemById).not.toHaveBeenCalled();
  });

  it("returns validation error when title is missing", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const result = await updateItem("item-1", {
      content: "content",
    });

    expect(result.success).toBe(false);
    expect(mockUpdateItemById).not.toHaveBeenCalled();
  });

  it("returns error when item is not found", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockUpdateItemById.mockResolvedValueOnce(null);

    const result = await updateItem("item-1", {
      title: "Updated",
      content: "New content",
      fileExtension: ".ts",
    });

    expect(result).toEqual({ success: false, error: "Item not found." });
  });

  it("returns success with updated item data", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockUpdateItemById.mockResolvedValueOnce(sampleItemDetail);

    const result = await updateItem("item-1", {
      title: "  Updated Title  ",
      content: "New content",
      fileExtension: ".ts",
    });

    expect(result).toEqual({ success: true, data: sampleItemDetail });
    expect(mockUpdateItemById).toHaveBeenCalledWith("user-1", "item-1", {
      title: "Updated Title",
      content: "New content",
      fileExtension: ".ts",
    });
  });

  it("uses default values for optional fields", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockUpdateItemById.mockResolvedValueOnce(sampleItemDetail);

    await updateItem("item-1", { title: "Title Only" });

    expect(mockUpdateItemById).toHaveBeenCalledWith("user-1", "item-1", {
      title: "Title Only",
      content: "",
      fileExtension: "",
    });
  });
});

describe("deleteItem server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when user is not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null);

    const result = await deleteItem("item-1");

    expect(result).toEqual({ success: false, error: "Unauthorized." });
    expect(mockDeleteItemById).not.toHaveBeenCalled();
  });

  it("returns error when item is not found or not owned by user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockDeleteItemById.mockResolvedValueOnce(false);

    const result = await deleteItem("item-1");

    expect(result).toEqual({ success: false, error: "Item not found." });
    expect(mockDeleteItemById).toHaveBeenCalledWith("user-1", "item-1");
  });

  it("returns success when item is deleted successfully", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockDeleteItemById.mockResolvedValueOnce(true);

    const result = await deleteItem("item-1");

    expect(result).toEqual({ success: true });
    expect(mockDeleteItemById).toHaveBeenCalledWith("user-1", "item-1");
  });

  it("returns error when db operation fails", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockDeleteItemById.mockRejectedValueOnce(new Error("DB error"));

    const result = await deleteItem("item-1");

    expect(result).toEqual({ success: false, error: "Something went wrong." });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

import {
  getUserEditorPreferences,
  updateUserEditorPreferences,
} from "./editor-preferences";

describe("editor preferences db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns defaults when there is no authenticated user", async () => {
    await expect(getUserEditorPreferences(null)).resolves.toEqual({
      fontSize: 13,
      tabSize: 2,
      wordWrap: true,
      minimap: false,
      theme: "vs-dark",
    });

    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
  });

  it("normalizes stored preferences from the database", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce({
      editorPreferences: {
        fontSize: 16,
        tabSize: 4,
        theme: "monokai",
      },
    });

    await expect(getUserEditorPreferences("user-1")).resolves.toEqual({
      fontSize: 16,
      tabSize: 4,
      wordWrap: true,
      minimap: false,
      theme: "monokai",
    });
  });

  it("returns null when updating a missing user", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce(null);

    await expect(
      updateUserEditorPreferences("missing", {
        fontSize: 14,
        tabSize: 4,
        wordWrap: false,
        minimap: true,
        theme: "github-dark",
      }),
    ).resolves.toBeNull();

    expect(mockDb.user.update).not.toHaveBeenCalled();
  });

  it("stores and returns normalized preferences when updating", async () => {
    mockDb.user.findUnique.mockResolvedValueOnce({ id: "user-1" });
    mockDb.user.update.mockResolvedValueOnce({
      editorPreferences: {
        fontSize: 18,
        tabSize: 8,
        wordWrap: false,
        minimap: true,
        theme: "github-dark",
      },
    });

    await expect(
      updateUserEditorPreferences("user-1", {
        fontSize: 18,
        tabSize: 8,
        wordWrap: false,
        minimap: true,
        theme: "github-dark",
      }),
    ).resolves.toEqual({
      fontSize: 18,
      tabSize: 8,
      wordWrap: false,
      minimap: true,
      theme: "github-dark",
    });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

const mockUpdateUserEditorPreferences = vi.fn();
vi.mock("@/lib/db/editor-preferences", () => ({
  updateUserEditorPreferences: (...args: unknown[]) => mockUpdateUserEditorPreferences(...args),
}));

import { updateEditorPreferencesAction } from "./editor-preferences";

describe("updateEditorPreferencesAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an authorization error when the user is not signed in", async () => {
    mockAuth.mockResolvedValueOnce(null);

    await expect(
      updateEditorPreferencesAction({
        fontSize: 13,
        tabSize: 2,
        wordWrap: true,
        minimap: false,
        theme: "vs-dark",
      }),
    ).resolves.toEqual({
      success: false,
      error: "Unauthorized.",
    });
  });

  it("returns a validation error for invalid values", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const result = await updateEditorPreferencesAction({
      fontSize: 99,
      tabSize: 2,
      wordWrap: true,
      minimap: false,
      theme: "vs-dark",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid font size");
    expect(mockUpdateUserEditorPreferences).not.toHaveBeenCalled();
  });

  it("returns an error when the user record no longer exists", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockUpdateUserEditorPreferences.mockResolvedValueOnce(null);

    await expect(
      updateEditorPreferencesAction({
        fontSize: 14,
        tabSize: 4,
        wordWrap: false,
        minimap: true,
        theme: "monokai",
      }),
    ).resolves.toEqual({
      success: false,
      error: "User not found.",
    });
  });

  it("returns saved preferences when the update succeeds", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mockUpdateUserEditorPreferences.mockResolvedValueOnce({
      fontSize: 16,
      tabSize: 4,
      wordWrap: false,
      minimap: true,
      theme: "github-dark",
    });

    await expect(
      updateEditorPreferencesAction({
        fontSize: "16",
        tabSize: "4",
        wordWrap: false,
        minimap: true,
        theme: "github-dark",
      }),
    ).resolves.toEqual({
      success: true,
      data: {
        fontSize: 16,
        tabSize: 4,
        wordWrap: false,
        minimap: true,
        theme: "github-dark",
      },
    });

    expect(mockUpdateUserEditorPreferences).toHaveBeenCalledWith("user-1", {
      fontSize: 16,
      tabSize: 4,
      wordWrap: false,
      minimap: true,
      theme: "github-dark",
    });
  });
});

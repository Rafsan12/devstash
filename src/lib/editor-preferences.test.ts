import { describe, expect, it } from "vitest";
import {
  DEFAULT_EDITOR_PREFERENCES,
  areEditorPreferencesEqual,
  getMonacoThemeId,
  normalizeEditorPreferences,
  updateEditorPreferencesSchema,
} from "./editor-preferences";

describe("editor preferences helpers", () => {
  it("returns defaults when the input is missing or invalid", () => {
    expect(normalizeEditorPreferences(null)).toEqual(DEFAULT_EDITOR_PREFERENCES);
    expect(normalizeEditorPreferences({ theme: "unknown" })).toEqual(
      DEFAULT_EDITOR_PREFERENCES,
    );
  });

  it("merges valid partial values with defaults", () => {
    expect(
      normalizeEditorPreferences({
        fontSize: 16,
        minimap: true,
      }),
    ).toEqual({
      ...DEFAULT_EDITOR_PREFERENCES,
      fontSize: 16,
      minimap: true,
    });
  });

  it("validates server action input values", () => {
    expect(
      updateEditorPreferencesSchema.parse({
        fontSize: "14",
        tabSize: "4",
        wordWrap: true,
        minimap: false,
        theme: "monokai",
      }),
    ).toEqual({
      fontSize: 14,
      tabSize: 4,
      wordWrap: true,
      minimap: false,
      theme: "monokai",
    });
  });

  it("compares preference objects field-by-field", () => {
    expect(
      areEditorPreferencesEqual(DEFAULT_EDITOR_PREFERENCES, {
        ...DEFAULT_EDITOR_PREFERENCES,
      }),
    ).toBe(true);
    expect(
      areEditorPreferencesEqual(DEFAULT_EDITOR_PREFERENCES, {
        ...DEFAULT_EDITOR_PREFERENCES,
        tabSize: 4,
      }),
    ).toBe(false);
  });

  it("builds Monaco theme ids from preference themes", () => {
    expect(getMonacoThemeId("vs-dark")).toBe("devstash-code-vs-dark");
    expect(getMonacoThemeId("github-dark")).toBe("devstash-code-github-dark");
  });
});

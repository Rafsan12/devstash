import { z } from "zod";

export const FONT_SIZE_OPTIONS = [12, 13, 14, 16, 18] as const;
export const TAB_SIZE_OPTIONS = [2, 4, 8] as const;
export const EDITOR_THEME_OPTIONS = ["vs-dark", "monokai", "github-dark"] as const;

export type EditorFontSize = (typeof FONT_SIZE_OPTIONS)[number];
export type EditorTabSize = (typeof TAB_SIZE_OPTIONS)[number];
export type EditorTheme = (typeof EDITOR_THEME_OPTIONS)[number];

export type EditorPreferences = {
  fontSize: EditorFontSize;
  tabSize: EditorTabSize;
  wordWrap: boolean;
  minimap: boolean;
  theme: EditorTheme;
};

export const DEFAULT_EDITOR_PREFERENCES: EditorPreferences = {
  fontSize: 13,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  theme: "vs-dark",
};

const fontSizeSchema = z
  .number()
  .int()
  .refine((value): value is EditorFontSize => {
    return FONT_SIZE_OPTIONS.includes(value as EditorFontSize);
  }, "Invalid font size");

const tabSizeSchema = z
  .number()
  .int()
  .refine((value): value is EditorTabSize => {
    return TAB_SIZE_OPTIONS.includes(value as EditorTabSize);
  }, "Invalid tab size");

const themeSchema = z.enum(EDITOR_THEME_OPTIONS);

export const editorPreferencesSchema = z.object({
  fontSize: fontSizeSchema,
  tabSize: tabSizeSchema,
  wordWrap: z.boolean(),
  minimap: z.boolean(),
  theme: themeSchema,
});

const partialEditorPreferencesSchema = editorPreferencesSchema.partial();

export const updateEditorPreferencesSchema = z.object({
  fontSize: z.coerce.number().pipe(fontSizeSchema),
  tabSize: z.coerce.number().pipe(tabSizeSchema),
  wordWrap: z.boolean(),
  minimap: z.boolean(),
  theme: themeSchema,
});

export function normalizeEditorPreferences(value: unknown): EditorPreferences {
  const parsed = partialEditorPreferencesSchema.safeParse(value);

  if (!parsed.success) {
    return DEFAULT_EDITOR_PREFERENCES;
  }

  return {
    ...DEFAULT_EDITOR_PREFERENCES,
    ...parsed.data,
  };
}

export function areEditorPreferencesEqual(
  left: EditorPreferences,
  right: EditorPreferences,
) {
  return (
    left.fontSize === right.fontSize &&
    left.tabSize === right.tabSize &&
    left.wordWrap === right.wordWrap &&
    left.minimap === right.minimap &&
    left.theme === right.theme
  );
}

export function getMonacoThemeId(theme: EditorTheme) {
  return `devstash-code-${theme}`;
}

"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEditorPreferences } from "@/components/editor-preferences/editor-preferences-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EDITOR_THEME_OPTIONS,
  FONT_SIZE_OPTIONS,
  TAB_SIZE_OPTIONS,
  type EditorFontSize,
  type EditorTabSize,
  type EditorTheme,
} from "@/lib/editor-preferences";
import { cn } from "@/lib/utils";

const editorThemeLabels: Record<EditorTheme, string> = {
  "vs-dark": "VS Dark",
  monokai: "Monokai",
  "github-dark": "GitHub Dark",
};

function PreferenceToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
        enabled
          ? "border-sky-400/30 bg-sky-400/10"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]",
      )}
      onClick={onToggle}
      type="button"
    >
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs text-zinc-400">{description}</p>
      </div>
      <span
        className={cn(
          "inline-flex min-w-14 justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
          enabled
            ? "bg-sky-300/15 text-sky-100"
            : "bg-white/5 text-zinc-400",
        )}
      >
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}

export function EditorPreferencesSection() {
  const { preferences, updatePreferences, isSaving } = useEditorPreferences();

  return (
    <section className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex flex-col gap-3 border-b border-white/8 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Editor Preferences</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Adjust how Monaco editors look and behave across your workspace.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400">
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              Autosaves
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">Font Size</label>
          <Select
            onValueChange={(value) => {
              updatePreferences({
                fontSize: Number.parseInt(value, 10) as EditorFontSize,
              });
            }}
            value={String(preferences.fontSize)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a font size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZE_OPTIONS.map((fontSize) => (
                <SelectItem key={fontSize} value={String(fontSize)}>
                  {fontSize}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-200">Tab Size</label>
          <Select
            onValueChange={(value) => {
              updatePreferences({
                tabSize: Number.parseInt(value, 10) as EditorTabSize,
              });
            }}
            value={String(preferences.tabSize)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a tab size" />
            </SelectTrigger>
            <SelectContent>
              {TAB_SIZE_OPTIONS.map((tabSize) => (
                <SelectItem key={tabSize} value={String(tabSize)}>
                  {tabSize} spaces
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-zinc-200">Theme</label>
          <Select
            onValueChange={(value) => {
              updatePreferences({ theme: value as EditorTheme });
            }}
            value={preferences.theme}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an editor theme" />
            </SelectTrigger>
            <SelectContent>
              {EDITOR_THEME_OPTIONS.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {editorThemeLabels[theme]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PreferenceToggle
          description="Wrap long lines instead of forcing horizontal scrolling."
          enabled={preferences.wordWrap}
          label="Word Wrap"
          onToggle={() => updatePreferences({ wordWrap: !preferences.wordWrap })}
        />
        <PreferenceToggle
          description="Show the code overview minimap on the right side."
          enabled={preferences.minimap}
          label="Minimap"
          onToggle={() => updatePreferences({ minimap: !preferences.minimap })}
        />
      </div>
    </section>
  );
}

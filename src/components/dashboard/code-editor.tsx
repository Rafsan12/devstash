"use client";

import dynamic from "next/dynamic";
import { Check, Copy } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import type * as Monaco from "monaco-editor";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-b-[22px] bg-[#0d1017]" />
    ),
  },
);

const HEADER_HEIGHT = 48;
const MIN_EDITOR_HEIGHT = 164;
const MAX_EDITOR_HEIGHT = 400;
const EDITOR_LINE_HEIGHT = 20;

const extensionLanguageMap: Record<string, string> = {
  ".bash": "shell",
  ".c": "c",
  ".cpp": "cpp",
  ".css": "css",
  ".go": "go",
  ".html": "html",
  ".java": "java",
  ".js": "javascript",
  ".json": "json",
  ".jsx": "javascript",
  ".md": "markdown",
  ".php": "php",
  ".py": "python",
  ".rb": "ruby",
  ".rs": "rust",
  ".sh": "shell",
  ".sql": "sql",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".txt": "plaintext",
  ".xml": "xml",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".zsh": "shell",
};

type CodeEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  itemTypeId: string;
  fileExtension?: string;
  readOnly?: boolean;
  placeholder?: string;
};

export function isCodeEditorItemType(itemTypeId: string) {
  return itemTypeId === "snippet" || itemTypeId === "command";
}

export function getEditorLanguage(itemTypeId: string, fileExtension?: string) {
  const normalizedExtension = normalizeExtension(fileExtension);

  if (normalizedExtension && extensionLanguageMap[normalizedExtension]) {
    return extensionLanguageMap[normalizedExtension];
  }

  if (itemTypeId === "command") {
    return "shell";
  }

  if (itemTypeId === "snippet") {
    return "typescript";
  }

  return "plaintext";
}

function normalizeExtension(fileExtension?: string) {
  const normalizedValue = (fileExtension ?? "").trim().toLowerCase();

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue.startsWith(".") ? normalizedValue : `.${normalizedValue}`;
}

function getEditorHeight(value: string) {
  const lineCount = Math.max(value.split("\n").length, 4);
  const contentHeight = lineCount * EDITOR_LINE_HEIGHT + HEADER_HEIGHT + 36;

  return Math.min(Math.max(contentHeight, MIN_EDITOR_HEIGHT), MAX_EDITOR_HEIGHT);
}

function formatLanguageLabel(language: string) {
  return language
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function CodeEditor({
  value,
  onChange,
  itemTypeId,
  fileExtension,
  readOnly = false,
  placeholder,
}: CodeEditorProps) {
  const [didCopy, setDidCopy] = useState(false);
  const editorInstanceId = useId().replace(/[:]/g, "");
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorLanguage = getEditorLanguage(itemTypeId, fileExtension);
  const editorHeight = getEditorHeight(value);
  const editorBodyHeight = Math.max(editorHeight - HEADER_HEIGHT, 116);
  const normalizedExtension = normalizeExtension(fileExtension) || ".txt";
  const editorPath = `inmemory://model/${editorInstanceId}-${itemTypeId}${normalizedExtension}`;
  const shouldShowPlaceholder = !value && Boolean(placeholder);

  useEffect(() => {
    if (!didCopy) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setDidCopy(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [didCopy]);

  useEffect(() => {
    editorRef.current?.layout();
  }, [editorBodyHeight, value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDidCopy(true);
      toast.success("Code copied.");
    } catch (error) {
      console.error("[code-editor copy error]", error);
      toast.error("Unable to copy the code.");
    }
  };

  const handleMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.layout();
  };

  const handleBeforeMount = (monaco: typeof Monaco) => {
    monaco.editor.defineTheme("devstash-code-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0d1017",
        "editor.foreground": "#d4d4d8",
        "editor.lineHighlightBackground": "#1a2131",
        "editor.lineHighlightBorder": "#00000000",
        "editorCursor.foreground": "#7dd3fc",
        "editor.selectionBackground": "#1d4ed866",
        "editor.inactiveSelectionBackground": "#1e293b66",
        "editorIndentGuide.background1": "#1f293733",
        "editorIndentGuide.activeBackground1": "#38bdf84d",
      },
    });
  };

  return (
    <div
      className="devstash-code-editor relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(10,14,22,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      style={{ height: `${editorHeight}px`, maxHeight: `${MAX_EDITOR_HEIGHT}px` }}
    >
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-200">
            {formatLanguageLabel(editorLanguage)}
          </span>
        </div>

        <button
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          onClick={handleCopy}
          type="button"
        >
          {didCopy ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {didCopy ? "Copied" : "Copy"}
        </button>
      </div>

      <div style={{ height: `${editorBodyHeight}px` }}>
        {shouldShowPlaceholder ? (
          <div className="pointer-events-none absolute inset-x-0 top-12 z-10 px-4 py-4 font-mono text-xs leading-5 text-zinc-600">
            {placeholder}
          </div>
        ) : null}
        <Editor
          beforeMount={handleBeforeMount}
          height={`${editorBodyHeight}px`}
          language={editorLanguage}
          loading={<div className="h-full w-full animate-pulse bg-[#0d1017]" />}
          onChange={(nextValue) => onChange?.(nextValue ?? "")}
          onMount={handleMount}
          options={{
            automaticLayout: true,
            contextmenu: !readOnly,
            cursorBlinking: "smooth",
            domReadOnly: readOnly,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontLigatures: true,
            fontSize: 13,
            lineHeight: EDITOR_LINE_HEIGHT,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            readOnly,
            renderLineHighlight: "gutter",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
              horizontalScrollbarSize: 10,
              useShadows: false,
              verticalScrollbarSize: 10,
            },
            smoothScrolling: true,
            tabSize: 2,
            wordWrap: "on",
          }}
          path={editorPath}
          theme="devstash-code-dark"
          value={value}
        />
      </div>
    </div>
  );
}

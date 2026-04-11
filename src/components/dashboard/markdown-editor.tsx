"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MIN_EDITOR_HEIGHT = 280;
const MAX_EDITOR_HEIGHT = 400;

type MarkdownEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
};

export function isMarkdownEditorItemType(itemTypeId: string) {
  return itemTypeId === "note" || itemTypeId === "prompt";
}

function getEditorHeight(value: string) {
  const lineCount = Math.max(value.split("\n").length, 4);
  const contentHeight = lineCount * 20 + 48 + 36;
  return Math.min(Math.max(contentHeight, MIN_EDITOR_HEIGHT), MAX_EDITOR_HEIGHT);
}

export function MarkdownEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">(
    readOnly ? "preview" : "write",
  );
  const [didCopy, setDidCopy] = useState(false);

  const editorHeight = getEditorHeight(value);
  const editorBodyHeight = Math.max(editorHeight - 48, 116);

  useEffect(() => {
    if (!didCopy) return undefined;
    const timeout = window.setTimeout(() => setDidCopy(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [didCopy]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDidCopy(true);
      toast.success("Copied to clipboard.");
    } catch (error) {
      console.error("[markdown-editor copy error]", error);
      toast.error("Unable to copy content.");
    }
  };

  return (
    <div
      className="devstash-markdown-editor relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.96)_0%,rgba(10,14,22,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      style={{ minHeight: `${editorHeight}px`, maxHeight: `${MAX_EDITOR_HEIGHT}px` }}
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>

          {/* Tabs */}
          {!readOnly && (
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-0.5">
              <button
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  activeTab === "write"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                onClick={() => setActiveTab("write")}
                type="button"
              >
                Write
              </button>
              <button
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  activeTab === "preview"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                onClick={() => setActiveTab("preview")}
                type="button"
              >
                Preview
              </button>
            </div>
          )}

          {readOnly && (
            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200">
              Markdown
            </span>
          )}
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

      {/* Body */}
      <div style={{ minHeight: `${editorBodyHeight}px` }}>
        {activeTab === "write" && !readOnly ? (
          <div className="relative h-full">
            {!value && placeholder && (
              <div className="pointer-events-none absolute inset-0 z-10 px-4 py-4 text-xs leading-5 text-zinc-600">
                {placeholder}
              </div>
            )}
            <textarea
              className="w-full resize-none bg-transparent px-4 py-4 font-mono text-xs leading-5 text-zinc-200 outline-none placeholder:text-zinc-600"
              onChange={(e) => onChange?.(e.target.value)}
              style={{ minHeight: `${editorBodyHeight}px` }}
              value={value}
            />
          </div>
        ) : (
          <div
            className="markdown-preview overflow-auto px-4 py-4"
            style={{ minHeight: `${editorBodyHeight}px`, maxHeight: `${MAX_EDITOR_HEIGHT - 48}px` }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-xs text-zinc-600">{placeholder ?? "Nothing to preview."}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { type ItemDetail } from "@/lib/db/items";
import { type DashboardSidebarCollection } from "@/lib/db/collections";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CodeEditor, isCodeEditorItemType } from "@/components/dashboard/code-editor";
import { MarkdownEditor, isMarkdownEditorItemType } from "@/components/dashboard/markdown-editor";
import { ItemTypeIcon, withAlpha } from "@/components/dashboard/item-type-icon";
import { toast } from "sonner";
import { useState } from "react";

type EditFormData = {
  title: string;
  content: string;
  fileExtension: string;
  collectionId: string;
};

type ItemDrawerProps = {
  item: ItemDetail | null;
  isLoading: boolean;
  isMutating: boolean;
  isEditing: boolean;
  open: boolean;
  collections: DashboardSidebarCollection[];
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (data: EditFormData) => void;
};

export type { EditFormData };

export function ItemDrawer({
  item,
  isLoading,
  isMutating,
  isEditing,
  open,
  collections,
  onOpenChange,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onEdit,
  onCancelEdit,
  onSave,
}: ItemDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        {isLoading ? (
          <DrawerSkeleton />
        ) : item ? (
          isEditing ? (
            <DrawerEditContent
              collections={collections}
              isMutating={isMutating}
              item={item}
              onCancel={onCancelEdit}
              onSave={onSave}
            />
          ) : (
            <DrawerContent
              isMutating={isMutating}
              item={item}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleFavorite={onToggleFavorite}
              onTogglePin={onTogglePin}
            />
          )
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function DrawerSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-48 rounded bg-white/10" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded bg-white/10" />
              <div className="h-5 w-20 rounded bg-white/10" />
            </div>
          </div>
        </div>
        <SheetTitle className="sr-only">Loading item...</SheetTitle>
        <SheetDescription className="sr-only">Loading item details</SheetDescription>
      </SheetHeader>
      <div className="h-px bg-white/10" />
      <div className="space-y-3">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
      </div>
      <div className="h-px bg-white/10" />
      <div className="space-y-4">
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="h-32 w-full rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

function DrawerContent({
  item,
  isMutating,
  onDelete,
  onEdit,
  onTogglePin,
  onToggleFavorite,
}: {
  item: ItemDetail;
  isMutating: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
}) {
  const isCodeItem = isCodeEditorItemType(item.itemTypeId);
  const isMarkdownItem = isMarkdownEditorItemType(item.itemTypeId);
  const formattedCreated = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedUpdated = new Date(item.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      toast.success("Item content copied.");
    } catch (error) {
      console.error("[item-drawer copy error]", error);
      toast.error("Unable to copy the item content.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SheetHeader>
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            style={{
              borderColor: withAlpha(item.itemType.color, "5c"),
              backgroundColor: withAlpha(item.itemType.color, "14"),
              color: item.itemType.color,
            }}
          >
            <ItemTypeIcon icon={item.itemType.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="truncate">{item.title}</SheetTitle>
            <SheetDescription className="sr-only">
              Details for {item.title}
            </SheetDescription>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span
                className="rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wider"
                style={{
                  borderColor: withAlpha(item.itemType.color, "40"),
                  backgroundColor: withAlpha(item.itemType.color, "14"),
                  color: item.itemType.color,
                }}
              >
                {item.itemTypeId}
              </span>
              <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-zinc-400">
                {item.fileExtension}
              </span>
            </div>
          </div>

          <SheetClose className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white">
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </SheetClose>
        </div>
      </SheetHeader>

      <div className="flex items-center gap-1 border-y border-white/10 py-2">
        <ActionButton
          active={item.isFavorite}
          disabled={isMutating}
          icon="star"
          label={item.isFavorite ? "Unfavorite" : "Favorite"}
          onClick={onToggleFavorite}
        />
        <ActionButton
          active={item.isPinned}
          disabled={isMutating}
          icon="pin"
          label={item.isPinned ? "Unpin" : "Pin"}
          onClick={onTogglePin}
        />
        <ActionButton
          disabled={isMutating}
          icon="copy"
          label="Copy"
          onClick={handleCopyClick}
        />
        <ActionButton icon="edit" label="Edit" onClick={onEdit} />
        <div className="flex-1" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ActionButton
              disabled={isMutating}
              icon="trash"
              label="Delete"
              onClick={() => {}}
              variant="danger"
            />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Item</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{item.title}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white hover:bg-red-600 border-0"
                onClick={onDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <section>
        <SectionLabel>Description</SectionLabel>
        <p className="mt-1 text-sm leading-6 text-zinc-300">
          {item.content.replace(/\s+/g, " ").trim().slice(0, 200) || "No description."}
        </p>
      </section>

      <section>
        <SectionLabel>Content</SectionLabel>
        <div className="mt-2">
          {isCodeItem ? (
            <CodeEditor
              fileExtension={item.fileExtension}
              itemTypeId={item.itemTypeId}
              readOnly
              value={item.content}
            />
          ) : isMarkdownItem ? (
            <MarkdownEditor readOnly value={item.content} />
          ) : (
            <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-white/[0.02] p-4 font-mono text-xs leading-5 text-zinc-300">
              <code>{item.content}</code>
            </pre>
          )}
        </div>
      </section>

      {item.tags.length > 0 && (
        <section>
          <SectionLabel icon="tag">Tags</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionLabel icon="collection">Collections</SectionLabel>
        <span className="mt-2 inline-block rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300">
          {item.collection.name}
        </span>
      </section>

      <section>
        <SectionLabel icon="details">Details</SectionLabel>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Created</dt>
            <dd className="text-zinc-300">{formattedCreated}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Updated</dt>
            <dd className="text-zinc-300">{formattedUpdated}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function DrawerEditContent({
  item,
  isMutating,
  collections,
  onCancel,
  onSave,
}: {
  item: ItemDetail;
  isMutating: boolean;
  collections: DashboardSidebarCollection[];
  onCancel: () => void;
  onSave: (data: EditFormData) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [fileExtension, setFileExtension] = useState(item.fileExtension);
  const [collectionId, setCollectionId] = useState(item.collection.id);
  const isCodeItem = isCodeEditorItemType(item.itemTypeId);
  const isMarkdownItem = isMarkdownEditorItemType(item.itemTypeId);

  const isTitleEmpty = title.trim().length === 0;

  const handleSave = () => {
    if (isTitleEmpty) return;
    onSave({ title: title.trim(), content, fileExtension: fileExtension.trim(), collectionId });
  };

  const formattedCreated = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedUpdated = new Date(item.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <SheetHeader>
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            style={{
              borderColor: withAlpha(item.itemType.color, "5c"),
              backgroundColor: withAlpha(item.itemType.color, "14"),
              color: item.itemType.color,
            }}
          >
            <ItemTypeIcon icon={item.itemType.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="truncate">Edit Item</SheetTitle>
            <SheetDescription className="sr-only">
              Editing {item.title}
            </SheetDescription>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span
                className="rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wider"
                style={{
                  borderColor: withAlpha(item.itemType.color, "40"),
                  backgroundColor: withAlpha(item.itemType.color, "14"),
                  color: item.itemType.color,
                }}
              >
                {item.itemTypeId}
              </span>
            </div>
          </div>
        </div>
      </SheetHeader>

      {/* Save / Cancel bar */}
      <div className="flex items-center gap-2 border-y border-white/10 py-2">
        <button
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isTitleEmpty || isMutating}
          onClick={handleSave}
          type="button"
        >
          {isMutating ? (
            <svg aria-hidden="true" className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          )}
          {isMutating ? "Saving..." : "Save"}
        </button>
        <button
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isMutating}
          onClick={onCancel}
          type="button"
        >
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          Cancel
        </button>
      </div>

      {/* Editable fields */}
      <section>
        <EditLabel htmlFor="edit-title" required>Title</EditLabel>
        <input
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06]"
          id="edit-title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item title"
          type="text"
          value={title}
        />
        {isTitleEmpty && (
          <p className="mt-1 text-xs text-red-400">Title is required.</p>
        )}
      </section>

      <section>
        <EditLabel htmlFor="edit-content">Content</EditLabel>
        <div className="mt-1.5">
          {isCodeItem ? (
            <CodeEditor
              fileExtension={fileExtension}
              itemTypeId={item.itemTypeId}
              onChange={setContent}
              placeholder="Item content"
              value={content}
            />
          ) : isMarkdownItem ? (
            <MarkdownEditor
              onChange={setContent}
              placeholder="Write your content in Markdown..."
              value={content}
            />
          ) : (
            <textarea
              className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs leading-5 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06]"
              id="edit-content"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Item content"
              rows={10}
              value={content}
            />
          )}
        </div>
      </section>

      <section>
        <EditLabel htmlFor="edit-file-extension">File Extension</EditLabel>
        <input
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06]"
          id="edit-file-extension"
          onChange={(e) => setFileExtension(e.target.value)}
          placeholder="e.g. .ts, .py, .md"
          type="text"
          value={fileExtension}
        />
      </section>

      <section>
        <EditLabel htmlFor="edit-collection">Collection</EditLabel>
        <div className="mt-1.5">
          <Select value={collectionId} onValueChange={setCollectionId}>
            <SelectTrigger id="edit-collection" className="w-full">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section>
        <SectionLabel icon="details">Details</SectionLabel>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Created</dt>
            <dd className="text-zinc-300">{formattedCreated}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Updated</dt>
            <dd className="text-zinc-300">{formattedUpdated}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function EditLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label
      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-zinc-500"
      htmlFor={htmlFor}
    >
      {children}
      {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
      {icon === "tag" && <TagIcon />}
      {icon === "collection" && <CollectionIcon />}
      {icon === "details" && <DetailsIcon />}
      {children}
    </h3>
  );
}

function ActionButton({
  icon,
  label,
  active,
  disabled,
  onClick,
  variant,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  variant?: "danger";
}) {
  const baseClass =
    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

  const colorClass =
    variant === "danger"
      ? "text-red-400 hover:bg-red-400/10 hover:text-red-300"
      : active
        ? "text-amber-400 hover:bg-amber-400/10"
        : "text-zinc-400 hover:bg-white/[0.06] hover:text-white";

  return (
    <button
      className={`${baseClass} ${colorClass}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <ActionIcon active={active} icon={icon} />
      {label}
    </button>
  );
}

function ActionIcon({ icon, active }: { icon: string; active?: boolean }) {
  const cls = "h-3.5 w-3.5";

  switch (icon) {
    case "star":
      return active ? (
        <svg aria-hidden="true" className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" className={cls} fill="none" viewBox="0 0 24 24">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "pin":
      return (
        <svg aria-hidden="true" className={cls} fill="none" viewBox="0 0 24 24">
          <path d="M12 17v4m-3-8.6L4 17h16l-5-4.6M9 4h6l1 6H8l1-6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "copy":
      return (
        <svg aria-hidden="true" className={cls} fill="none" viewBox="0 0 24 24">
          <rect height="12" rx="2" stroke="currentColor" strokeWidth="1.8" width="12" x="8" y="8" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "edit":
      return (
        <svg aria-hidden="true" className={cls} fill="none" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "trash":
      return (
        <svg aria-hidden="true" className={cls} fill="none" viewBox="0 0 24 24">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    default:
      return null;
  }
}

function TagIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24">
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function DetailsIcon() {
  return (
    <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

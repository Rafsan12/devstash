"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { type DashboardRecentCollection } from "@/lib/db/collections";
import { updateCollectionAction, deleteCollectionAction } from "@/actions/collections";
import { ItemTypeIcon, withAlpha } from "./item-type-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Three-dots menu (no external dropdown library needed)
// ---------------------------------------------------------------------------

function CollectionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function stopAndRun(fn: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fn();
      setOpen(false);
    };
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        aria-label="Collection actions"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/10 hover:text-zinc-300"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        type="button"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[144px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40">
          <button
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            onClick={stopAndRun(onEdit)}
            type="button"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            onClick={stopAndRun(() => {})}
            type="button"
          >
            <Star className="h-3.5 w-3.5" />
            Favorite
          </button>
          <div className="my-1 border-t border-white/8" />
          <button
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            onClick={stopAndRun(onDelete)}
            type="button"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit modal
// ---------------------------------------------------------------------------

function EditCollectionModal({
  open,
  onOpenChange,
  collection,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Pick<DashboardRecentCollection, "id" | "name" | "description">;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(
    collection.description === "No description yet." ? "" : collection.description,
  );

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName(collection.name);
      setDescription(
        collection.description === "No description yet." ? "" : collection.description,
      );
    }
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateCollectionAction(collection.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });

        if (result.success) {
          toast.success("Collection updated");
          onOpenChange(false);
          router.refresh();
        } else {
          toast.error(result.error ?? "Failed to update collection");
        }
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Update the name or description.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="edit-collection-name">Name</Label>
              <Input
                autoComplete="off"
                autoFocus
                id="edit-collection-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Patterns"
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-collection-description">
                Description <span className="text-zinc-500">(optional)</span>
              </Label>
              <Textarea
                className="resize-none"
                id="edit-collection-description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What kind of items will you store here?"
                rows={3}
                value={description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit" variant="premium">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Delete confirmation dialog
// ---------------------------------------------------------------------------

function DeleteCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  collectionName,
  afterDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  collectionName: string;
  afterDelete?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteCollectionAction(collectionId);

        if (result.success) {
          toast.success("Collection deleted. Items have been moved.");
          onOpenChange(false);
          if (afterDelete) {
            afterDelete();
          } else {
            router.refresh();
          }
        } else {
          toast.error(result.error ?? "Failed to delete collection");
        }
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{collectionName}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            The collection will be permanently deleted. All items inside will be moved to
            another collection — nothing will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="border border-red-500/20 bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:text-red-300"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Collection"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------------------------------------------------------------------------
// Main export: the card that navigates on click + has a 3-dots menu
// ---------------------------------------------------------------------------

export function ClickableCollectionCard({
  collection,
  afterDelete,
}: {
  collection: DashboardRecentCollection;
  afterDelete?: () => void;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <article
        className="cursor-pointer rounded-[22px] border bg-black/30 p-5 transition hover:bg-white/[0.02]"
        onClick={() => router.push(`/collections/${collection.id}`)}
        style={{
          borderColor: withAlpha(collection.dominantTypeColor, "52"),
          boxShadow: `inset 0 1px 0 ${withAlpha(collection.dominantTypeColor, "24")}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">{collection.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
              {collection.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: withAlpha(collection.dominantTypeColor, "1f"),
                color: collection.dominantTypeColor,
              }}
            >
              {collection.typeCount} types
            </span>
            <CollectionMenu
              onDelete={() => setDeleteOpen(true)}
              onEdit={() => setEditOpen(true)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-zinc-500">
          <span>{collection.itemCount} items</span>
          <div className="flex items-center gap-2">
            <span>{collection.typeCount} content types</span>
            <div className="flex items-center gap-1.5">
              {collection.types.map((type) => (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border"
                  key={type.id}
                  style={{
                    borderColor: withAlpha(type.color, "5c"),
                    backgroundColor: withAlpha(type.color, "14"),
                    color: type.color,
                  }}
                  title={type.id}
                >
                  <ItemTypeIcon icon={type.icon} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      <EditCollectionModal
        collection={collection}
        onOpenChange={setEditOpen}
        open={editOpen}
      />
      <DeleteCollectionDialog
        afterDelete={afterDelete}
        collectionId={collection.id}
        collectionName={collection.name}
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
      />
    </>
  );
}

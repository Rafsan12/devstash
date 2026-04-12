"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { updateCollectionAction, deleteCollectionAction } from "@/actions/collections";
import { toggleCollectionFavoriteAction } from "@/actions/favorites";
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

type CollectionMeta = {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
};

export function CollectionDetailActions({ collection }: { collection: CollectionMeta }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(collection.isFavorite);
  const [isFavPending, startFavTransition] = useTransition();

  function handleToggleFavorite() {
    startFavTransition(async () => {
      const prev = isFavorite;
      setIsFavorite(!prev);
      try {
        const result = await toggleCollectionFavoriteAction(collection.id);
        if (result.success) {
          toast.success(result.data.isFavorite ? "Added to favorites." : "Removed from favorites.");
          router.refresh();
        } else {
          setIsFavorite(prev);
          toast.error(result.error ?? "Failed to update favorite.");
        }
      } catch {
        setIsFavorite(prev);
        toast.error("Something went wrong.");
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setEditOpen(true)}
          size="sm"
          title="Edit collection"
          variant="ghost"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          disabled={isFavPending}
          onClick={handleToggleFavorite}
          size="sm"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          variant="ghost"
        >
          <Star className={isFavorite ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4"} />
          {isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
        <Button
          onClick={() => setDeleteOpen(true)}
          size="sm"
          title="Delete collection"
          variant="danger"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <EditCollectionModal
        collection={collection}
        onOpenChange={setEditOpen}
        open={editOpen}
      />
      <DeleteCollectionDialog
        collectionId={collection.id}
        collectionName={collection.name}
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
      />
    </>
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
  collection: CollectionMeta;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const normalizedDescription =
    collection.description === "No description yet." ? "" : collection.description;

  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(normalizedDescription);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName(collection.name);
      setDescription(normalizedDescription);
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
              <Label htmlFor="detail-edit-name">Name</Label>
              <Input
                autoComplete="off"
                autoFocus
                id="detail-edit-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Patterns"
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail-edit-description">
                Description <span className="text-zinc-500">(optional)</span>
              </Label>
              <Textarea
                className="resize-none"
                id="detail-edit-description"
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  collectionName: string;
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
          router.push("/collections");
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

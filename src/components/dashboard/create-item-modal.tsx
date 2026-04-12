"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createItemAction } from "@/actions/items";
import { CodeEditor, isCodeEditorItemType } from "@/components/dashboard/code-editor";
import { MarkdownEditor, isMarkdownEditorItemType } from "@/components/dashboard/markdown-editor";
import { type DashboardSidebarCollection } from "@/lib/db/collections";
import { type DashboardSidebarItemType } from "@/lib/db/items";

interface CreateItemModalProps {
  collections: DashboardSidebarCollection[];
  itemTypes: DashboardSidebarItemType[];
}

export function CreateItemModal({ collections, itemTypes }: CreateItemModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Form state
  const [itemTypeId, setItemTypeId] = useState<string>("snippet");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [collectionId, setCollectionId] = useState<string>(collections[0]?.id ?? "");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFileExtension("");
    setCollectionId(collections[0]?.id ?? "");
    // Keep itemTypeId as it is likely to be reused
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!collectionId) {
      toast.error("No collection is available yet");
      return;
    }

    if (itemTypeId === "link" && !content.trim()) {
      toast.error("URL is required for links");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createItemAction({
          title: title.trim(),
          content: content.trim(),
          itemTypeId,
          collectionId,
          fileExtension: fileExtension.trim(),
        });

        if (result.success) {
          toast.success("Item created successfully");
          setOpen(false);
          resetForm();
          router.refresh();
        } else {
          toast.error(result.error || "Failed to create item");
        }
      } catch (error) {
        console.error("[createItem error]", error);
        toast.error("Something went wrong");
      }
    });
  };

  const isSnippetOrCommand = isCodeEditorItemType(itemTypeId);
  const isPromptOrNote = isMarkdownEditorItemType(itemTypeId);
  const isLink = itemTypeId === "link";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="h-10 min-w-0 justify-center gap-2 rounded-2xl px-3 text-xs font-semibold whitespace-nowrap shadow-[0_10px_24px_-12px_rgba(99,102,241,0.9)] hover:shadow-[0_14px_30px_-14px_rgba(99,102,241,1)] sm:h-11 sm:min-w-[132px] sm:px-4 sm:text-sm"
          variant="premium"
        >
          <Plus className="h-4 w-4" />
          <span>New Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Item</DialogTitle>
            <DialogDescription>
              Add a new snippet, prompt, or link to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="type">Item Type</Label>
              <Select value={itemTypeId} onValueChange={setItemTypeId}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {itemTypes
                    .filter((t) => ["snippet", "prompt", "command", "note", "link"].includes(t.id))
                    .map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select value={collectionId} onValueChange={setCollectionId}>
                <SelectTrigger id="collection">
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

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
            </div>

            {isLink && (
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}

            {isSnippetOrCommand && (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <CodeEditor
                    itemTypeId={itemTypeId}
                    fileExtension={fileExtension}
                    onChange={setContent}
                    placeholder="Paste your code or command here..."
                    value={content}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ext">Extension</Label>
                  <Input
                    id="ext"
                    placeholder=".ts"
                    value={fileExtension}
                    onChange={(e) => setFileExtension(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            {isPromptOrNote && (
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Enter your prompt or note here..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="premium" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { Textarea } from "@/components/ui/textarea";
import { createItemAction } from "@/actions/items";
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
  const defaultCollectionId = collections[0]?.id ?? "";

  // Form state
  const [itemTypeId, setItemTypeId] = useState<string>("snippet");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileExtension, setFileExtension] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFileExtension("");
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

    if (!defaultCollectionId) {
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
          collectionId: defaultCollectionId,
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

  const isSnippetOrCommand = itemTypeId === "snippet" || itemTypeId === "command";
  const isPromptOrNote = itemTypeId === "prompt" || itemTypeId === "note";
  const isLink = itemTypeId === "link";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="premium" className="group px-6 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)]">
          <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90 group-active:scale-90" />
          <span className="relative">New Item</span>
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
                  <Textarea
                    id="content"
                    placeholder="Paste your code or command here..."
                    className="h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                <Textarea
                  id="content"
                  placeholder="Enter your prompt or note here..."
                  className="h-40"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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

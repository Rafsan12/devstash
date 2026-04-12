"use client";

import { type DashboardItemCardData, type ItemDetail } from "@/lib/db/items";
import { type DashboardSidebarCollection } from "@/lib/db/collections";
import { ItemDrawer, type EditFormData } from "@/components/dashboard/item-drawer";
import { deleteItem, updateItem } from "@/actions/items";
import { toggleItemFavoriteAction } from "@/actions/favorites";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useCallback, type ReactNode } from "react";

type ItemDrawerContextValue = {
  openItem: (itemId: string) => void;
};

import { createContext, useContext } from "react";

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) {
    throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  }
  return ctx;
}

export function ItemDrawerProvider({
  children,
  collections = [],
}: {
  children: ReactNode;
  collections?: DashboardSidebarCollection[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const openItem = useCallback(async (itemId: string) => {
    setOpen(true);
    setIsLoading(true);
    setItem(null);
    setIsEditing(false);

    try {
      const response = await fetch(`/api/items/${itemId}`);
      if (response.ok) {
        const data: ItemDetail = await response.json();
        setItem(data);
      }
    } catch (error) {
      console.error("[item-drawer fetch error]", error);
      toast.error("Unable to load the item details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTogglePin = useCallback(async () => {
    if (!item) {
      return;
    }

    setIsMutating(true);

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update pin state.");
      }

      const updatedItem: ItemDetail = await response.json();
      setItem(updatedItem);
      router.refresh();
      toast.success(updatedItem.isPinned ? "Item pinned." : "Item unpinned.");
    } catch (error) {
      console.error("[item-drawer toggle-pin error]", error);
      toast.error("Unable to update the item right now.");
    } finally {
      setIsMutating(false);
    }
  }, [item, router]);

  const handleDelete = useCallback(async () => {
    if (!item) {
      return;
    }

    setIsMutating(true);

    try {
      const result = await deleteItem(item.id);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setOpen(false);
      setItem(null);
      setIsEditing(false);
      router.refresh();
      toast.success("Item deleted.");
    } catch (error) {
      console.error("[item-drawer delete error]", error);
      toast.error("Unable to delete the item right now.");
    } finally {
      setIsMutating(false);
    }
  }, [item, router]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleToggleFavorite = useCallback(async () => {
    if (!item) return;

    setIsMutating(true);
    try {
      const result = await toggleItemFavoriteAction(item.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setItem((prev) => prev ? { ...prev, isFavorite: result.data.isFavorite } : prev);
      router.refresh();
      toast.success(result.data.isFavorite ? "Added to favorites." : "Removed from favorites.");
    } catch (error) {
      console.error("[item-drawer toggle-favorite error]", error);
      toast.error("Unable to update the item right now.");
    } finally {
      setIsMutating(false);
    }
  }, [item, router]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(async (formData: EditFormData) => {
    if (!item) {
      return;
    }

    setIsMutating(true);

    try {
      const result = await updateItem(item.id, formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setItem(result.data);
      setIsEditing(false);
      router.refresh();
      toast.success("Item updated.");
    } catch (error) {
      console.error("[item-drawer save error]", error);
      toast.error("Unable to save the item right now.");
    } finally {
      setIsMutating(false);
    }
  }, [item, router]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setIsEditing(false);
    }
  }, []);

  return (
    <ItemDrawerContext.Provider value={{ openItem }}>
      {children}
      <ItemDrawer
        collections={collections}
        isEditing={isEditing}
        isLoading={isLoading}
        isMutating={isMutating}
        item={item}
        onCancelEdit={handleCancelEdit}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onOpenChange={handleOpenChange}
        onSave={handleSave}
        onToggleFavorite={handleToggleFavorite}
        onTogglePin={handleTogglePin}
        open={open}
      />
    </ItemDrawerContext.Provider>
  );
}

export function ClickableItemCard({
  item,
  children,
}: {
  item: DashboardItemCardData;
  children: ReactNode;
}) {
  const { openItem } = useItemDrawer();

  return (
    <button
      className="w-full cursor-pointer text-left"
      onClick={() => openItem(item.id)}
      type="button"
    >
      {children}
    </button>
  );
}

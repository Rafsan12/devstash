"use client";

import { type DashboardItemCardData, type ItemDetail } from "@/lib/db/items";
import { ItemDrawer } from "@/components/dashboard/item-drawer";
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

export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const openItem = useCallback(async (itemId: string) => {
    setOpen(true);
    setIsLoading(true);
    setItem(null);

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

    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) {
      return;
    }

    setIsMutating(true);

    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item.");
      }

      setOpen(false);
      setItem(null);
      router.refresh();
      toast.success("Item deleted.");
    } catch (error) {
      console.error("[item-drawer delete error]", error);
      toast.error("Unable to delete the item right now.");
    } finally {
      setIsMutating(false);
    }
  }, [item, router]);

  return (
    <ItemDrawerContext.Provider value={{ openItem }}>
      {children}
      <ItemDrawer
        isLoading={isLoading}
        isMutating={isMutating}
        item={item}
        onDelete={handleDelete}
        onOpenChange={setOpen}
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

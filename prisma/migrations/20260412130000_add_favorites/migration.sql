-- AlterTable: add isFavorite to Item
ALTER TABLE "Item" ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: add isFavorite to Collection
ALTER TABLE "Collection" ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false;

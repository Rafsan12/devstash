-- Alter the legacy enum first so the new "ItemType" table can use that name.
ALTER TYPE "ItemType" RENAME TO "LegacyItemType";

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "isPro" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ItemType" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("id")
);

-- Seed system item types needed to migrate existing items safely.
INSERT INTO "ItemType" ("id", "icon", "color", "isSystem")
VALUES
    ('snippet', 'Code', '#3b82f6', true),
    ('prompt', 'Sparkles', '#8b5cf6', true),
    ('command', 'Terminal', '#f97316', true),
    ('note', 'StickyNote', '#fde047', true),
    ('file', 'File', '#6b7280', true),
    ('image', 'Image', '#ec4899', true),
    ('link', 'Link', '#10b981', true);

-- AlterTable
ALTER TABLE "Item"
ADD COLUMN "itemTypeId" TEXT;

-- Migrate existing enum-based item types to the new lookup table.
UPDATE "Item"
SET "itemTypeId" = CASE "type"
    WHEN 'code'::"LegacyItemType" THEN 'snippet'
    WHEN 'prompt'::"LegacyItemType" THEN 'prompt'
    WHEN 'text'::"LegacyItemType" THEN 'file'
    ELSE 'note'
END;

-- AlterTable
ALTER TABLE "Item"
ALTER COLUMN "itemTypeId" SET NOT NULL;

-- Drop the legacy enum-backed column.
ALTER TABLE "Item"
DROP COLUMN "type";

DROP TYPE "LegacyItemType";

-- CreateIndex
CREATE INDEX "Item_itemTypeId_idx" ON "Item"("itemTypeId");

-- CreateIndex
CREATE INDEX "Item_collectionId_idx" ON "Item"("collectionId");

-- CreateIndex
CREATE INDEX "Item_userId_idx" ON "Item"("userId");

-- AddForeignKey
ALTER TABLE "Item"
ADD CONSTRAINT "Item_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "ItemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

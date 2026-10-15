-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FaqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "details" TEXT,
    "sources" TEXT,
    "checkedBy" TEXT,
    "checkedOn" TEXT,
    "related" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sourceId" INTEGER,
    "sourceSlug" TEXT,
    "sourceModified" DATETIME,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FaqItem" ("answer", "category", "createdAt", "id", "order", "published", "question") SELECT "answer", "category", "createdAt", "id", "order", "published", "question" FROM "FaqItem";
DROP TABLE "FaqItem";
ALTER TABLE "new_FaqItem" RENAME TO "FaqItem";
CREATE UNIQUE INDEX "FaqItem_slug_key" ON "FaqItem"("slug");
CREATE UNIQUE INDEX "FaqItem_sourceId_key" ON "FaqItem"("sourceId");
CREATE INDEX "FaqItem_published_category_order_idx" ON "FaqItem"("published", "category", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroImage" TEXT,
    "highlights" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vessel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER,
    "heroImage" TEXT,
    "gallery" TEXT,
    "amenities" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Expedition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "startingFrom" TEXT,
    "priceFrom" REAL,
    "priceCurrency" TEXT NOT NULL DEFAULT 'USD',
    "heroImage" TEXT,
    "itinerary" TEXT,
    "included" TEXT,
    "excluded" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "vesselId" TEXT,
    CONSTRAINT "Expedition_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExpeditionDestination" (
    "expeditionId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,

    PRIMARY KEY ("expeditionId", "destinationId"),
    CONSTRAINT "ExpeditionDestination_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExpeditionDestination_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "expeditionId" TEXT,
    "emailStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inquiry_expeditionId_fkey" FOREIGN KEY ("expeditionId") REFERENCES "Expedition" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE INDEX "Destination_published_order_idx" ON "Destination"("published", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_slug_key" ON "Vessel"("slug");

-- CreateIndex
CREATE INDEX "Vessel_published_idx" ON "Vessel"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Expedition_slug_key" ON "Expedition"("slug");

-- CreateIndex
CREATE INDEX "Expedition_published_order_idx" ON "Expedition"("published", "order");

-- CreateIndex
CREATE INDEX "FaqItem_published_category_order_idx" ON "FaqItem"("published", "category", "order");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

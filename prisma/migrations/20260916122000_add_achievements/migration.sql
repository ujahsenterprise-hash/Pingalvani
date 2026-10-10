CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" TEXT,
    "organization" TEXT,
    "category" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "cloudinaryPublicId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Achievement_isPublished_sortOrder_idx" ON "Achievement"("isPublished", "sortOrder");
CREATE INDEX "Achievement_year_idx" ON "Achievement"("year");

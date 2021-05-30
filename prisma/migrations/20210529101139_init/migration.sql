-- CreateTable
CREATE TABLE "Links" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "target" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Links.slug_unique" ON "Links"("slug");

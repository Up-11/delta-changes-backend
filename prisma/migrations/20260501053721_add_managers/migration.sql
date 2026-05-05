-- AlterTable
ALTER TABLE "media" ADD COLUMN     "manager_id" TEXT;

-- CreateTable
CREATE TABLE "managers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "phone" TEXT,
    "is_head" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "managers_is_active_idx" ON "managers"("is_active");

-- CreateIndex
CREATE INDEX "managers_sort_order_idx" ON "managers"("sort_order");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

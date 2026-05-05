-- AlterTable
ALTER TABLE "objects" ADD COLUMN     "concept_text" TEXT,
ADD COLUMN     "concept_title" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "hero_address" TEXT,
ADD COLUMN     "hero_completion" TEXT,
ADD COLUMN     "hero_finishing" TEXT,
ADD COLUMN     "hero_floors" TEXT;

-- CreateTable
CREATE TABLE "construction_progress" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "object_id" TEXT NOT NULL,

    CONSTRAINT "construction_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "construction_media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "progress_id" TEXT NOT NULL,

    CONSTRAINT "construction_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "construction_progress_object_id_idx" ON "construction_progress"("object_id");

-- CreateIndex
CREATE INDEX "construction_progress_year_month_idx" ON "construction_progress"("year", "month");

-- AddForeignKey
ALTER TABLE "construction_progress" ADD CONSTRAINT "construction_progress_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "construction_media" ADD CONSTRAINT "construction_media_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "construction_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

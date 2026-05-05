/*
  Warnings:

  - You are about to drop the column `description` on the `objects` table. All the data in the column will be lost.
  - You are about to drop the column `hero_address` on the `objects` table. All the data in the column will be lost.
  - You are about to drop the column `hero_completion` on the `objects` table. All the data in the column will be lost.
  - You are about to drop the column `hero_finishing` on the `objects` table. All the data in the column will be lost.
  - You are about to drop the column `hero_floors` on the `objects` table. All the data in the column will be lost.
  - You are about to drop the `construction_media` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InfrastructureCategory" AS ENUM ('EDUCATION', 'SHOPPING', 'HEALTH', 'SPORT', 'LEISURE', 'TRANSPORT');

-- DropForeignKey
ALTER TABLE "construction_media" DROP CONSTRAINT "construction_media_progress_id_fkey";

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "construction_progress_id" TEXT;

-- AlterTable
ALTER TABLE "objects" DROP COLUMN "description",
DROP COLUMN "hero_address",
DROP COLUMN "hero_completion",
DROP COLUMN "hero_finishing",
DROP COLUMN "hero_floors";

-- DropTable
DROP TABLE "construction_media";

-- CreateTable
CREATE TABLE "infrastructure_points" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "InfrastructureCategory" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "object_id" TEXT NOT NULL,

    CONSTRAINT "infrastructure_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "infrastructure_points_object_id_idx" ON "infrastructure_points"("object_id");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_construction_progress_id_fkey" FOREIGN KEY ("construction_progress_id") REFERENCES "construction_progress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infrastructure_points" ADD CONSTRAINT "infrastructure_points_object_id_fkey" FOREIGN KEY ("object_id") REFERENCES "objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to alter the column `rate` on the `cars` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `rate` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
-- DropIndex
DROP INDEX "comments_car_id_parent_id_idx";

-- AlterTable
ALTER TABLE "cars" ALTER COLUMN "rate" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "rate" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE INDEX "comments_car_id_parent_id_is_confirmed_idx" ON "comments"("car_id", "parent_id", "is_confirmed");

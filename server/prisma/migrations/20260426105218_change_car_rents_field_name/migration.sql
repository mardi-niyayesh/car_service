/*
  Warnings:

  - You are about to drop the column `started_date` on the `car_rents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[car_id,start_date,end_date]` on the table `car_rents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `start_date` to the `car_rents` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "car_rents_car_id_started_date_end_date_key";

-- AlterTable
ALTER TABLE "car_rents" DROP COLUMN "started_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "car_rents_car_id_start_date_end_date_key" ON "car_rents"("car_id", "start_date", "end_date");

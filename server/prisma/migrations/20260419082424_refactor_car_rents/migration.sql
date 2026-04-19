/*
  Warnings:

  - You are about to drop the column `price_at_hour` on the `cars` table. All the data in the column will be lost.
  - Added the required column `price_at_day` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RentStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- DropIndex
DROP INDEX "car_rents_car_id_key";

-- AlterTable
ALTER TABLE "car_rents" ADD COLUMN     "status" "RentStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "cars" DROP COLUMN "price_at_hour",
ADD COLUMN     "price_at_day" INTEGER NOT NULL;

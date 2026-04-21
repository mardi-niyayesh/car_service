/*
  Warnings:

  - You are about to drop the column `end_at` on the `car_rents` table. All the data in the column will be lost.
  - You are about to drop the column `started_at` on the `car_rents` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `car_rents` table. All the data in the column will be lost.
  - You are about to drop the column `price_at_day` on the `cars` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[car_id,started_date,end_date]` on the table `car_rents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cart_id` to the `car_rents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `car_rents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_day` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RentStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "car_rents" DROP CONSTRAINT "car_rents_user_id_fkey";

-- AlterTable
ALTER TABLE "car_rents" DROP COLUMN "end_at",
DROP COLUMN "started_at",
DROP COLUMN "user_id",
ADD COLUMN     "cart_id" UUID NOT NULL,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "started_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "cars" DROP COLUMN "price_at_day",
ADD COLUMN     "price_per_day" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_price" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "car_rents_cart_id_idx" ON "car_rents"("cart_id");

-- CreateIndex
CREATE INDEX "car_rents_status_idx" ON "car_rents"("status");

-- CreateIndex
CREATE UNIQUE INDEX "car_rents_car_id_started_date_end_date_key" ON "car_rents"("car_id", "started_date", "end_date");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_rents" ADD CONSTRAINT "car_rents_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

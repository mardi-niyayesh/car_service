/*
  Warnings:

  - You are about to alter the column `description` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `description` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" VARCHAR(500);

-- AlterTable
ALTER TABLE "permissions" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

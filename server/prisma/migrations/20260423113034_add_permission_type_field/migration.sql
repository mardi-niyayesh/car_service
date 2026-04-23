-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('CORE', 'MANAGER', 'STANDARD');

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "permission_type" "PermissionType" NOT NULL DEFAULT 'STANDARD';

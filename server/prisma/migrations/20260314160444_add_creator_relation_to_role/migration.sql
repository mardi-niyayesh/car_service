-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "creator" TEXT;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

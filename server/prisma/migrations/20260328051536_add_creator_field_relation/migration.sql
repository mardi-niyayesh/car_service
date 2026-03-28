-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "creator" TEXT;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

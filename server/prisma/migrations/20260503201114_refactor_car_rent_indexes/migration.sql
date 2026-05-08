-- DropIndex
DROP INDEX "car_rents_status_idx";

-- CreateIndex
CREATE INDEX "car_rents_status_created_at_idx" ON "car_rents"("status", "created_at");

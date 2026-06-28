-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "amount" INTEGER NOT NULL,
    "transaction_id" VARCHAR(120),
    "car_rent_id" UUID NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_car_rent_id_key" ON "payments"("car_rent_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_car_rent_id_fkey" FOREIGN KEY ("car_rent_id") REFERENCES "car_rents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

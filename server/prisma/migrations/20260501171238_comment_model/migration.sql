-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "rate" INTEGER NOT NULL DEFAULT 5,
    "parent_id" UUID,
    "user_id" UUID NOT NULL,
    "car_id" UUID NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_car_id_parent_id_idx" ON "comments"("car_id", "parent_id");

-- CreateIndex
CREATE INDEX "comments_is_confirmed_created_at_idx" ON "comments"("is_confirmed", "created_at");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

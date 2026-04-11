import type {Car, Category} from "@/modules/prisma/generated/client";

/** car api response */
export interface CarResponse {
  car: Car & {
    category: Category;
  };
}
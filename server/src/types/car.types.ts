import {ListWithCount} from "./response.types";
import type {Car, Category} from "@/modules/prisma/generated/client";

export type CarAndCategory = Car & {
  category: Category;
};

/** car api response */
export interface CarResponse {
  car: CarAndCategory;
}

export type CarsResponse = ListWithCount<{
  cars: CarAndCategory[];
}>;
import type {SafeCategory} from "./category.types";
import type {ListWithCount} from "./response.types";
import type {Car} from "@/modules/prisma/generated/client";

export type CarAndCategory = Omit<Car, 'creator_id'> & {
  category: SafeCategory;
};

/** car api response */
export interface CarResponse {
  car: CarAndCategory;
}

export type CarsResponse = ListWithCount<{
  cars: CarAndCategory[];
}>;
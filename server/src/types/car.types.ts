import type {ListWithCount} from "./response.types";
import type {SafeCategory} from "@/types/category.types";
import type {Car, CarRent, Category} from "@/modules/prisma/generated/client";

/** car without creator_id */
export type SafeCar = Omit<Car, "creator_id">;

/** normal car and category */
export type CarAndCategory = Car & {
  category: Category;
};

/** car and category without creator_id */
export interface SafeCarNCategory {
  car: SafeCar & {
    category: SafeCategory;
    _count: {
      users_favorites: number;
      comments: number;
    }
  };
}

/** car api response */
export interface CarResponse {
  car: CarAndCategory;
}

export type CarsResponse = ListWithCount<{
  cars: SafeCarNCategory['car'][];
}>;

export type GetRentedDatesCarResponse = ListWithCount<{
  dates: Pick<CarRent, "id" | "start_date" | "end_date" | "status">[];
}>

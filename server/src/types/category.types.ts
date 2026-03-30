import {Category} from "@/modules/prisma/generated/client";
import {ListWithCount} from "@/types/response.types";

/** one category response */
export interface CategoryResponse {
  category: Category;
}

/** type of list category response */
export interface CategoriesResponse {
  categories: Category[];
}

/** type of list category response with count */
export type CategoriesResponseWithCount = ListWithCount<CategoriesResponse>;
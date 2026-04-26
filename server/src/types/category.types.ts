import {ListWithCount} from "@/types/response.types";
import {Category} from "@/modules/prisma/generated/client";

type SafeCategory = Omit<Category, "creator_id">;

/** one category response */
export interface CategoryResponse {
  category: SafeCategory;
}

/** type of list category response */
export interface CategoriesResponse {
  categories: SafeCategory[];
}

/** type of list category response with count */
export type CategoriesResponseCount = ListWithCount<CategoriesResponse>;
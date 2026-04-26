import {ListWithCount} from "@/types/response.types";
import {Category} from "@/modules/prisma/generated/client";

export type SafeCategory = Omit<Category, "creator_id">;

/** one category response */
export interface CategoryResponse {
  category: Category;
}

/** category without creator_id */
export interface SafeCategoryResponse {
  category: SafeCategory;
}

/** type of list category response */
export interface CategoriesResponse {
  categories: SafeCategory[];
}

/** type of list category response with count */
export type CategoriesResponseCount = ListWithCount<CategoriesResponse>;
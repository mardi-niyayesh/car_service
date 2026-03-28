import {Category} from "@/modules/prisma/generated/client";

/** one category response */
export interface CategoryResponse {
  category: Category;
}
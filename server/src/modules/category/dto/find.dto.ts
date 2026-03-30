import {CategoriesResponse} from "@/types";
import {categoryExampleRes} from "./create.dto";
import {getBaseOkResponseSchema} from "@/common";

/** find all categories example response */
export class FindAllCategoriesRes extends getBaseOkResponseSchema<CategoriesResponse>({
  path: 'categories?order=desc&limit=5&page=1',
  response: {
    message: 'categories successfully found.',
    data: {
      categories: Array.from({length: 5}, () => categoryExampleRes)
    }
  }
}) {}
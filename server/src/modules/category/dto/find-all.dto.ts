import {getBaseOkResponseSchema} from "@/common";
import type {CategoriesResponseCount} from "@/types";
import {safeCategoryExampleRes} from "./find-one.dto";

/** find all categories example response */
export class FindAllCategoriesRes extends getBaseOkResponseSchema<CategoriesResponseCount>({
  path: 'categories?order=desc&limit=5&page=1',
  response: {
    message: 'categories successfully found.',
    data: {
      count: 5,
      categories: Array.from({length: 5}, () => safeCategoryExampleRes),
    }
  }
}) {}
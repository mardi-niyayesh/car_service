import {getZodErrorBody} from "@/common";
import {ApiParamOptions} from "@nestjs/swagger";
import {maxCategorySlug, minCategorySlug} from "./create.dto";

/** find one category slug param swagger */
export const findOneCategoryParam: ApiParamOptions = {
  name: 'slug',
  type: String,
  example: "category-slug4",
  required: true,
  description: 'category slug',
  schema: {
    minimum: minCategorySlug,
    maximum: maxCategorySlug,
  }
};

/** bad request example */
export class FindOneBadRequest extends getZodErrorBody({
  path: "/categories/-iuo",
  errors: [
    {
      field: "slug",
      error: "Slug can only contain lowercase letters, numbers, and hyphens (-)."
    }
  ]
}) {}
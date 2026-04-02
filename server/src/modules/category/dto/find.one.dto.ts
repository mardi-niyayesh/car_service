import z from "zod";
import {getNormalErrorResponse, getZodErrorBody} from "@/common";
import {ApiParamOptions} from "@nestjs/swagger";
import {CreateCategoryValidator, maxCategorySlug, minCategorySlug} from "./create.dto";

/** find one category validator */
export const FindOneCategoryValidator = CreateCategoryValidator.pick({
  slug: true
});

/** find one category validator type */
export type FindOneCategoryType = z.infer<typeof FindOneCategoryValidator>;

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

/** not found example */
export class FindOneCategoryNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: "/categories/test",
  message: "Category does not exist in database",
  error: "Category not found"
}) {}
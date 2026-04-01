import z from "zod";
import {exampleDate} from "@/lib";
import {createZodDto} from "nestjs-zod";
import {CategoryResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody, OwnerShipValidator} from "@/common";

export const minCategorySlug = 2;
export const maxCategorySlug = 150;

/** base category validator */
export const CreateCategoryValidator = OwnerShipValidator.extend({
  name: z.string().min(2).max(100),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(minCategorySlug)
    .max(maxCategorySlug)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens (-).",
    }),

  description: z.string().min(10).max(500).optional(),
});

/** type of create category validator */
export type CreateCategoryType = z.infer<typeof CreateCategoryValidator>;

/** swagger body example */
export class CreateCategoryDto extends createZodDto(CreateCategoryValidator) {}

/** example ok create category data response */
export const categoryExampleRes: CategoryResponse['category'] = {
  id: "6d17a3c5-fcd8-4667-bf31-66843a9623e6",
  created_at: exampleDate,
  updated_at: exampleDate,
  name: "test category",
  slug: "test_category",
  description: "test test test",
  creator: "e537de94-2f4f-4685-8c2b-29809d52bcb2"
};

/** example ok create category response */
export class CreateCategoryOkRes extends getBaseOkResponseSchema<CategoryResponse>({
  path: 'categories',
  create: true,
  response: {
    message: 'Category successfully created.',
    data: {
      category: categoryExampleRes,
    }
  }
}) {}

/** bad request example */
export class CreateCategoryBadReq extends getZodErrorBody({
  path: 'categories',
  errors: [
    {
      field: "ownership",
      error: "Invalid input: expected boolean, received number"
    },
    {
      field: "name",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "slug",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "description",
      error: "Invalid input: expected string, received number"
    }
  ]
}) {}

/** Conflict response example */
export class CrateCategoryConflict extends getNormalErrorResponse({
  path: 'categories',
  message: "Category already exists in database",
  error: "category exists",
  statusCode: 409
}) {}
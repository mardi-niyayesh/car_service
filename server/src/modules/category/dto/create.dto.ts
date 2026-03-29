import z from "zod";
import {createZodDto} from "nestjs-zod";
import {getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody, OwnerShipValidator} from "@/common";
import {CategoryResponse} from "@/types";
import {exampleDate} from "@/lib";

/** base category validator */
export const CreateCategoryValidator = OwnerShipValidator.extend({
  name: z.string().min(2).max(100),

  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Name can only contain English letters, numbers, and underscores."}),

  description: z.string().min(10).max(500).optional(),
});

/** type of create category validator */
export type CreateCategoryType = z.infer<typeof CreateCategoryValidator>;

/** swagger body example */
export class CreateCategoryDto extends createZodDto(CreateCategoryValidator) {}

export const categoryExampleRes: CategoryResponse['category'] = {
  id: "6d17a3c5-fcd8-4667-bf31-66843a9623e6",
  created_at: exampleDate,
  updated_at: exampleDate,
  name: "test category",
  slug: "test_category",
  description: "test test test",
  creator: "e537de94-2f4f-4685-8c2b-29809d52bcb2"
};

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
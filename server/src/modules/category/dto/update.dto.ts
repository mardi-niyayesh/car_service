import z from "zod";
import {createZodDto} from "nestjs-zod";
import {CategoryResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";
import {categoryExampleRes, CreateCategoryValidator} from "./create.dto";

/** validator */
export const UpdateCategoryValidator = CreateCategoryValidator.pick({
  name: true,
  description: true,
}).partial().refine(data => data.name || data.description, {
  error: 'Either name or id must be provided',
  path: ['name', 'description'],
});

/** type of validator */
export type UpdateCategoryType = z.infer<typeof UpdateCategoryValidator>;

/** example swagger body */
export class UpdateCategoryDto extends createZodDto(UpdateCategoryValidator) {}

/** example ok response */
export class UpdateCategoryOkRes extends getBaseOkResponseSchema<CategoryResponse>({
  path: 'categories/id',
  response: {
    message: 'category updated successfully.',
    data: {
      category: categoryExampleRes,
    }
  }
}) {}

/** forbidden example response */
export class ForbiddenUpdateCategoryRes extends getNormalErrorResponse({
  statusCode: 403,
  path: "categories/id",
  message: "Access denied. Only the creator of this resource is allowed to perform this action.",
  error: "Ownership Verification Failed"
}) {}

/** conflict example response */
export class UpdateCategoryConflictRes extends getNormalErrorResponse({
  statusCode: 409,
  path: "/categories/id",
  message: "At least one field must differ from the existing category data. These fields have unchanged values: name.",
  error: "Category update conflict"
}) {}
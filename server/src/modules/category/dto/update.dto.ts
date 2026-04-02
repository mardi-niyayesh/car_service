import z from "zod";
import {createZodDto} from "nestjs-zod";
import {getNormalErrorResponse} from "@/common";
import {CreateCategoryValidator} from "./create.dto";

/** validator */
export const UpdateCategoryValidator = CreateCategoryValidator.pick({
  name: true,
  description: true,
});

/** type of validator */
export type UpdateCategoryType = z.infer<typeof UpdateCategoryValidator>;

/** example swagger body */
export class UpdateCategoryDto extends createZodDto(UpdateCategoryValidator) {}

/** forbidden example response */
export class ForbiddenUpdateCategoryRes extends getNormalErrorResponse({
  statusCode: 403,
  path: "categories/id",
  message: "Access denied. Only the creator of this resource is allowed to perform this action.",
  error: "Ownership Verification Failed"
}) {}
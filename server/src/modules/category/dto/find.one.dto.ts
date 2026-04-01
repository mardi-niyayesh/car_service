import {getZodErrorBody} from "@/common";

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
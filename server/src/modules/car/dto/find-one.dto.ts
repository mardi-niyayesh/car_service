import {getZodErrorBody} from "@/common";

/** bad request example response */
export class FindOneCarBadReq extends getZodErrorBody({
  path: "cars/slug",
  errors: [
    {
      field: "",
      error: "Too small: expected string to have >=2 characters"
    }
  ]
}) {}
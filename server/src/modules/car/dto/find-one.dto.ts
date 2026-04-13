import {CarResponse} from "@/types";
import {exampleCarRecord} from "./create.dto";
import {getBaseOkResponseSchema, getZodErrorBody} from "@/common";

/** Ok example response */
export class FindOneOkRes extends getBaseOkResponseSchema<CarResponse>({
  path: "cars/slug",
  response: {
    message: "Car successfully found.",
    data: {
      car: exampleCarRecord
    }
  }
}) {}

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
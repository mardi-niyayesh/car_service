import {CarResponse, CarsResponse} from "@/types";
import {exampleCarRecord} from "./create.dto";
import {getBaseOkResponseSchema, getZodErrorBody} from "@/common";

/** Ok example response for find one car */
export class FindOneCarOkRes extends getBaseOkResponseSchema<CarResponse>({
  path: "cars/slug",
  response: {
    message: "Car successfully found.",
    data: {
      car: exampleCarRecord
    }
  }
}) {}

/** bad request example response for find one car */
export class FindOneCarBadReq extends getZodErrorBody({
  path: "cars/slug",
  errors: [
    {
      field: "",
      error: "Too small: expected string to have >=2 characters"
    }
  ]
}) {}

/** ok example response for find all cars */
export class FindAllCarOkRes extends getBaseOkResponseSchema<CarsResponse>({
  path: 'cars',
  response: {
    message: 'cars successfully found.',
    data: {
      count: 5,
      cars: Array.from({length: 5}, () => exampleCarRecord)
    }
  }
}) {}

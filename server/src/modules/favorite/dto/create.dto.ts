import {getNormalErrorResponse} from "@/common";

/** NotFound Example response */
export class CreateNotFoundRes extends getNormalErrorResponse({
  statusCode: 404,
  path: "/api/v1/favorites/car_id",
  message: "car not exist exists in database, please change car",
  error: "car not exists"
}) {}

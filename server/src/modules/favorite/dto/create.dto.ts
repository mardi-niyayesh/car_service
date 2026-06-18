import {getNormalErrorResponse} from "@/common";

/** NotFound Example response */
export class CreateNotFoundRes extends getNormalErrorResponse({
  statusCode: 404,
  path: "/api/v1/favorites/car_id",
  message: "car not exist exists in database, please change car",
  error: "car not exists"
}) {}

/** Conflict Example response */
export class CreateConflictRes extends getNormalErrorResponse({
  statusCode: 409,
  path: "/api/v1/favorites/car_id",
  message: "favorite already exists in database, please change favorite",
  error: "favorite already exists"
}) {}

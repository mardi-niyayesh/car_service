import {exampleDate} from "@/lib";
import {FavoriteResponse} from "@/types";
import type {Favorite} from "@/modules/prisma/generated/client";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

export const favoriteExample: Favorite = {
  id: "16358d81-2166-463a-aed6-c0d79b0b3f89",
  created_at: exampleDate,
  updated_at: exampleDate,
  user_id: "7e1d66d6-0823-43af-8a6e-737b6923778c",
  car_id: "9e4f7159-ab7f-4ac8-96d8-52be77108105"
};

/** Example ok response */
export class CreateOkRes extends getBaseOkResponseSchema<FavoriteResponse>({
  create: true,
  statusCode: 201,
  path: "/api/v1/favorites/car_id",
  response: {
    message: "The car successfully add to user favorites",
    data: {
      favorite: favoriteExample
    }
  }
}) {}

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

import {favoriteExample} from "./create.dto";
import type {FavoriteResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

export class OkDeleteRes extends getBaseOkResponseSchema<FavoriteResponse>({
  response: {
    message: '',
    data: {
      favorite: favoriteExample
    }
  },
  path: "favorite/id"
}) {}

export class NotFoundDeleteRes extends getNormalErrorResponse({
  statusCode: 404,
  path: 'favroite/id',
  message: "favorite not found in database, please check car_id_user_id",
  error: "favorite not found"
}) {}

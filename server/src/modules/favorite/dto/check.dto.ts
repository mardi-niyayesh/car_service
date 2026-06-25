import type {FavoriteCheck} from "@/types";
import {getBaseOkResponseSchema} from "@/common";

export class OkCheckRes extends getBaseOkResponseSchema<FavoriteCheck>({
  path: 'favorites/check/car_id',
  response: {
    message: 'Favorite status checked successfully.',
    data: {
      isFavorite: true,
    }
  }
}) {}

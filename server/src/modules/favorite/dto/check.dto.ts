import {getBaseOkResponseSchema} from "@/common";
import {FavoriteCheck} from "@/types";

export class OkCheckRes extends getBaseOkResponseSchema<FavoriteCheck>({
  path: 'favorites/check/car_id',
  response: {
    message: 'Favorite status checked successfully.',
    data: {
      isFavorite: true,
    }
  }
}) {}

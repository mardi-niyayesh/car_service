import {favoriteExample} from "./create.dto";
import {getBaseOkResponseSchema} from "@/common";
import {exampleCarRecord} from "@/modules/car/dto/create.dto";
import type {FavoriteWithCar, ListFavoriteResponse} from "@/types";

const {user_id, ...othersFavoriteData} = favoriteExample;

void user_id;

const favoriteWithCarExample: FavoriteWithCar = {
  ...othersFavoriteData,
  car: {
    ...exampleCarRecord
  }
};

/** example get favorite list response */
export class OkGetFavoriteRes extends getBaseOkResponseSchema<ListFavoriteResponse>({
  response: {
    message: "get favorites successfully.",
    data: {
      count: 5,
      favorites: Array.from({length: 5}, () => favoriteWithCarExample)
    },
  },
  path: 'favorites?page=1&limit=5&order=desc'
}) {}

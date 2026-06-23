import {FavoriteResponse} from "@/types";
import {favoriteExample} from "./create.dto";
import {getBaseOkResponseSchema} from "@/common";

export class OkDeleteRes extends getBaseOkResponseSchema<FavoriteResponse>({
  response: {
    message: '',
    data: {
      favorite: favoriteExample
    }
  },
  path: "favorite/id"
}) {}

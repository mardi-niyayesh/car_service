import type {ListWithCount} from "@/types/response.types";
import type {Favorite} from "@/modules/prisma/generated/client";

export type FavoriteResponse = {
  favorite: Favorite;
};

export type ListFavoriteResponse = ListWithCount<{
  favorites: Omit<Favorite, 'user_id'>[];
}>;

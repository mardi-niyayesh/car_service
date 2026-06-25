import type {ListWithCount} from "@/types/response.types";
import type {Car, Favorite} from "@/modules/prisma/generated/client";

export type FavoriteResponse = {
  favorite: Favorite;
};

export type FavoriteWithCar = Omit<Favorite, 'user_id'> & {
  car: Car;
};

export type ListFavoriteResponse = ListWithCount<{
  favorites: FavoriteWithCar[];
}>;

export type FavoriteCheck = { isFavorite: boolean };

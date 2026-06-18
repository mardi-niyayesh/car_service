import type {Favorite} from "@/modules/prisma/generated/client";

export type FavoriteResponse = {
  favorite: Favorite;
};
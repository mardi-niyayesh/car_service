import {checkPrismaError} from "@/lib";
import {Injectable} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ApiResponse} from "@/types";
import {FavoriteResponse} from "@/types/favorite.types";

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, car_id: string): Promise<ApiResponse<FavoriteResponse>> {
    try {
      const favorite = await this.prisma.favorite.create({
        data: {
          user_id,
          car_id
        }
      });

      return {
        message: "The car successfully add to user favorites",
        data: {
          favorite
        }
      };
    } catch (e) {
      checkPrismaError({
        e: e as Error,
        conflictField: "favorite",
        mainResource: 'favorite',
        notFoundField: 'car',
        notFoundResource: 'car'
      });
    }
  }
}

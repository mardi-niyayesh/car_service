import {checkPrismaError} from "@/lib";
import {Injectable} from "@nestjs/common";
import {PaginationValidatorType} from "@/common";
import type {ApiResponse, FavoriteResponse, ListFavoriteResponse} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {FavoriteWhereInput} from "@/modules/prisma/generated/models/Favorite";

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Adds a car to the user's favorites list.
   *
   * @param user_id - The ID of the authenticated user
   * @param car_id - The ID of the car to be favorite
   * @returns A promise containing the API response with the created favorite record
   *
   */
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

  async get(user_id: string, car_id: string, pagination: PaginationValidatorType): Promise<ApiResponse<ListFavoriteResponse>> {
    const {orderByLower, limit, offset} = pagination;
    const where: FavoriteWhereInput = {
      user_id,
      car_id,
    };

    const count: number = await this.prisma.favorite.count({
      where
    });

    const favorites = await this.prisma.favorite.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        created_at: orderByLower
      }
    });

    console.log(count);
    console.log(favorites);

    return {
      message: "get favorites successfully.",
      data: {
        count,
        favorites
      }
    };
  }
}

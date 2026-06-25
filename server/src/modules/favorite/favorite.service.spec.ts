import type {PrismaMock} from "@/types";
import {FavoriteService} from "./favorite.service";
import {describe, afterEach, beforeEach} from "vitest";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Favorite} from "@/modules/prisma/generated/client";

describe('FavoriteService', (): void => {
  let prisma: PrismaMock;
  let service: FavoriteService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new FavoriteService(prisma);
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  const mockDate = new Date();
  const mockUserId = 'user-123';
  const mockCarId = 'car-789';

  const mockFavorite: Favorite = {
    id: 'fav-456',
    created_at: mockDate,
    updated_at: mockDate,
    user_id: mockUserId,
    car_id: mockCarId,
  };

  /** ================================================
   * Create (Add to favorites)
   * ================================================
   */
  describe('create()', (): void => {

  });
});

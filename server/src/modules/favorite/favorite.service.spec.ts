import type {PrismaMock} from "@/types";
import {FavoriteService} from "./favorite.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {describe, afterEach, beforeEach, it, expect} from "vitest";
import {type Favorite, Prisma} from "@/modules/prisma/generated/client";
import {NotFoundException} from "@nestjs/common";

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
    // success
    it('should add a car to user favorites successfully', async (): Promise<void> => {
      prisma.favorite.create.mockResolvedValue(mockFavorite);

      const result = await service.create(mockUserId, mockCarId);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('favorite');

      // 2. Test message
      expect(result.message).toBe('The car successfully add to user favorites');

      // 3. Test favorite data
      const {favorite} = result.data;
      expect(favorite.id).toBe(mockFavorite.id);
      expect(favorite.user_id).toBe(mockUserId);
      expect(favorite.car_id).toBe(mockCarId);
      expect(favorite.created_at).toBe(mockDate);
      expect(favorite.updated_at).toBe(mockDate);

      // 4. Verify Prisma create call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: {
          user_id: mockUserId,
          car_id: mockCarId,
        }
      });
    });

    // error: duplicate favorite (user already has this car in favorite list)
    it('should throw ConflictException when user already has this car in favorites', async (): Promise<void> => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2002';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {target: ['user_id_car_id']};

      prisma.favorite.create.mockRejectedValue(prismaError);

      await expect(service.create(mockUserId, mockCarId))
        .rejects
        .toThrow();
    });

    // error: car not found
    it('should throw NotFoundException when car_id does not exist', async (): Promise<void> => {
      const prismaError = new Error('Foreign key constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2003';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {field_name: 'car_id'};

      prisma.favorite.create.mockRejectedValue(prismaError);

      // noinspection ES6RedundantAwait
      await expect(service.create(mockUserId, mockCarId))
        .rejects
        .toThrow();
    });
  });
});

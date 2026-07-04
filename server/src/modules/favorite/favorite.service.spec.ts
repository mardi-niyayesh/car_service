import type {PrismaMock} from "@/types";
import {PaginationValidatorType} from "@/common";
import {FavoriteService} from "./favorite.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {describe, afterEach, beforeEach, it, expect} from "vitest";
import {type Favorite, Prisma} from "@/modules/prisma/generated/client";

interface CheckFavoriteFieldsType {
  mockDate: Date;
  mockCarId: string;
  mockUserId: string;
  favorite: Favorite;
  mockFavorite: Favorite;
}

const checkFavoriteFields = (params: CheckFavoriteFieldsType) => {
  const {favorite, mockFavorite, mockCarId, mockDate, mockUserId} = params;

  expect(favorite.id).toBe(mockFavorite.id);
  expect(favorite.user_id).toBe(mockUserId);
  expect(favorite.car_id).toBe(mockCarId);
  expect(favorite.created_at).toBe(mockDate);
  expect(favorite.updated_at).toBe(mockDate);
};

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
      checkFavoriteFields({favorite: result.data.favorite, mockFavorite, mockCarId, mockDate, mockUserId});

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

    // error: user not found (optional - if user_id foreign key exists)
    it('should throw NotFoundException when user_id does not exist', async (): Promise<void> => {
      const prismaError = new Error('Foreign key constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2003';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {field_name: 'user_id'};

      prisma.favorite.create.mockRejectedValue(prismaError);

      // noinspection ES6RedundantAwait
      await expect(service.create(mockUserId, mockCarId))
        .rejects
        .toThrow();
    });
  });

  /** ================================================
   * Get Favorites (List)
   * ================================================
   */
  describe('get()', (): void => {
    const mockUserId = 'user-123';
    const mockDate = new Date();

    const mockCar = {
      id: 'car-789',
      created_at: mockDate,
      updated_at: mockDate,
      name: 'BMW X5',
      slug: 'bmw-x5-2024',
      company: 'BMW',
      price_per_day: 200000,
      tags: ['luxury', 'suv'],
      image: 'car-789.png',
      can_rent: true,
      rate: 5,
      description: 'A luxurious BMW X5',
      category_id: 'cat-456',
    };

    const mockFavorites = [
      {
        id: 'fav-1',
        created_at: mockDate,
        updated_at: mockDate,
        car_id: 'car-789',
        car: mockCar,
      },
      {
        id: 'fav-2',
        created_at: new Date(Date.now() - 86400000), // yesterday
        updated_at: new Date(Date.now() - 86400000),
        car_id: 'car-456',
        car: {
          ...mockCar,
          id: 'car-456',
          name: 'Mercedes GLE',
          slug: 'mercedes-gle',
          company: 'Mercedes',
          price_per_day: 300000,
          image: 'car-456.png',
        },
      },
    ];

    const mockPaginationInput: PaginationValidatorType = {
      limit: 10,
      offset: 0,
      page: 1,
      orderByLower: 'desc',
      orderByUpper: 'DESC',
    };

    // success
    it('should return paginated list of user favorites with car details', async (): Promise<void> => {
      prisma.favorite.count.mockResolvedValue(2);
      prisma.favorite.findMany.mockResolvedValue(mockFavorites as unknown as Favorite[]);

      const result = await service.get(mockUserId, mockPaginationInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('favorites');

      // 2. Test message
      expect(result.message).toBe('get favorites successfully.');

      // 3. Test count and favorites array
      expect(result.data.count).toBe(2);
      expect(Array.isArray(result.data.favorites)).toBe(true);
      expect(result.data.favorites.length).toBe(2);

      // 4. Test favorite structure (user_id should be omitted)
      const [firstFavorite] = result.data.favorites;
      expect(firstFavorite.id).toBe(mockFavorites[0].id);
      expect(firstFavorite.car_id).toBe(mockFavorites[0].car_id);
      expect(firstFavorite).not.toHaveProperty('user_id');

      // 5. Test car inclusion
      expect(firstFavorite.car).toBeDefined();
      expect(firstFavorite.car.id).toBe(mockCar.id);
      expect(firstFavorite.car.name).toBe(mockCar.name);
      expect(firstFavorite.car.slug).toBe(mockCar.slug);
      expect(firstFavorite.car).not.toHaveProperty('creator_id');

      // 6. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.count).toHaveBeenCalledWith({
        where: {user_id: mockUserId}
      });

      // 7. Verify findMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.findMany).toHaveBeenCalledWith({
        where: {user_id: mockUserId},
        include: {car: true},
        omit: {user_id: true},
        take: mockPaginationInput.limit,
        skip: mockPaginationInput.offset,
        orderBy: {
          created_at: mockPaginationInput.orderByLower
        }
      });
    });

    // success: empty favorites
    it('should return count 0 and empty array when user has no favorites', async (): Promise<void> => {
      prisma.favorite.count.mockResolvedValue(0);
      prisma.favorite.findMany.mockResolvedValue([]);

      const result = await service.get(mockUserId, mockPaginationInput);

      expect(result.data.count).toBe(0);
      expect(result.data.favorites).toEqual([]);
      expect(result.message).toBe('get favorites successfully.');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.count).toHaveBeenCalledWith({
        where: {user_id: mockUserId}
      });
    });

    // success: with custom pagination
    it('should apply correct pagination and sorting parameters', async (): Promise<void> => {
      const customPagination: PaginationValidatorType = {
        limit: 5,
        offset: 10,
        page: 3,
        orderByLower: 'asc',
        orderByUpper: 'ASC',
      };

      prisma.favorite.count.mockResolvedValue(12);
      prisma.favorite.findMany.mockResolvedValue([mockFavorites[0]] as unknown as Favorite[]);

      await service.get(mockUserId, customPagination);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.findMany).toHaveBeenCalledWith({
        where: {user_id: mockUserId},
        include: {car: true},
        omit: {user_id: true},
        take: 5,
        skip: 10,
        orderBy: {
          created_at: 'asc'
        }
      });
    });

    // success: verify car doesn't have creator_id
    it('should return car without creator_id field', async (): Promise<void> => {
      const favoriteWithCar = {
        ...mockFavorites[0],
        car: {
          ...mockCar,
        },
      };

      prisma.favorite.count.mockResolvedValue(1);
      prisma.favorite.findMany.mockResolvedValue([favoriteWithCar] as unknown as Favorite[]);

      const result = await service.get(mockUserId, mockPaginationInput);

      const {car} = result.data.favorites[0];
      expect(car).not.toHaveProperty('creator_id');
      expect(car.id).toBe(mockCar.id);
      expect(car.name).toBe(mockCar.name);
    });
  });

  /** ================================================
   * Check By ID (Check if car is in favorites)
   * =================================================
   */
  describe('checkByID()', (): void => {
    const mockUserId = 'user-123';
    const mockCarId = 'car-789';
    const mockFavoriteId = 'fav-456';

    // success: car is in favorites
    it('should return is_favorite: true and favorite_id when car exists in user favorites', async (): Promise<void> => {
      prisma.favorite.findUnique.mockResolvedValue({id: mockFavoriteId} as unknown as Favorite);

      const result = await service.checkByID(mockUserId, mockCarId);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('is_favorite');
      expect(result.data).toHaveProperty('favorite_id');

      // 2. Test message
      expect(result.message).toBe('Favorite status checked successfully.');

      // 3. Test values
      expect(result.data.is_favorite).toBe(true);
      expect(result.data.favorite_id).toBe(mockFavoriteId);

      // 4. Verify Prisma findUnique call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          car_id_user_id: {
            user_id: mockUserId,
            car_id: mockCarId
          }
        },
        select: {id: true}
      });
    });

    // success: car is not in favorites
    it('should return is_favorite: false and favorite_id: undefined when car does not exist in user favorites', async (): Promise<void> => {
      prisma.favorite.findUnique.mockResolvedValue(null);

      const result = await service.checkByID(mockUserId, mockCarId);

      expect(result.data.is_favorite).toBe(false);
      expect(result.data.favorite_id).toBeUndefined();
      expect(result.message).toBe('Favorite status checked successfully.');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          car_id_user_id: {
            user_id: mockUserId,
            car_id: mockCarId
          }
        },
        select: {id: true}
      });
    });

    // success: different user and car combination
    it('should return correct status for different user-car combinations', async (): Promise<void> => {
      const differentUserId = 'user-456';
      const differentCarId = 'car-456';
      const differentFavoriteId = 'fav-789';

      prisma.favorite.findUnique.mockResolvedValue({id: differentFavoriteId} as unknown as Favorite);

      const result = await service.checkByID(differentUserId, differentCarId);

      expect(result.data.is_favorite).toBe(true);
      expect(result.data.favorite_id).toBe(differentFavoriteId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          car_id_user_id: {
            user_id: differentUserId,
            car_id: differentCarId
          }
        },
        select: {id: true}
      });
    });

    // edge case: user_id or car_id empty strings (validation should handle this, but test behavior)
    it('should return is_favorite: false and favorite_id: undefined when favorite not found with given IDs', async (): Promise<void> => {
      prisma.favorite.findUnique.mockResolvedValue(null);

      const result = await service.checkByID('non-existent-user', 'non-existent-car');

      expect(result.data.is_favorite).toBe(false);
      expect(result.data.favorite_id).toBeUndefined();
      expect(result.message).toBe('Favorite status checked successfully.');
    });
  });

  /** ================================================
   * Delete (Remove from favorites)
   * ================================================
   */
  describe('delete()', (): void => {
    const mockUserId = 'user-123';
    const mockCarId = 'car-789';
    const mockDate = new Date();

    const mockFavorite: Favorite = {
      id: 'fav-456',
      created_at: mockDate,
      updated_at: mockDate,
      user_id: mockUserId,
      car_id: mockCarId,
    };

    // success
    it('should remove a car from user favorites successfully', async (): Promise<void> => {
      prisma.favorite.delete.mockResolvedValue(mockFavorite);

      const result = await service.delete(mockUserId, mockCarId);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('favorite');

      // 2. Test message
      expect(result.message).toBe('The car successfully removed from user favorites');

      // 3. Test deleted favorite data
      checkFavoriteFields({favorite: result.data.favorite, mockFavorite, mockCarId, mockDate, mockUserId});

      // 4. Verify Prisma delete call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: {
          car_id_user_id: {
            user_id: mockUserId,
            car_id: mockCarId
          }
        }
      });
    });

    // error: favorite not found
    it('should throw NotFoundException when favorite does not exist', async (): Promise<void> => {
      const prismaError = new Error('Record to delete does not exist');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.favorite.delete.mockRejectedValue(prismaError);

      // noinspection ES6RedundantAwait
      await expect(service.delete(mockUserId, mockCarId))
        .rejects
        .toThrow();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: {
          car_id_user_id: {
            user_id: mockUserId,
            car_id: mockCarId
          }
        }
      });
    });

    // error: trying to delete non-existent favorite for different user
    it('should throw NotFoundException when trying to delete favorite that belongs to another user', async (): Promise<void> => {
      const prismaError = new Error('Record to delete does not exist');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.favorite.delete.mockRejectedValue(prismaError);

      const differentUserId = 'user-456';

      // noinspection ES6RedundantAwait
      await expect(service.delete(differentUserId, mockCarId))
        .rejects
        .toThrow();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: {
          car_id_user_id: {
            user_id: differentUserId,
            car_id: mockCarId
          }
        }
      });
    });

    // error: trying to delete non-existent car from user favorites
    it('should throw NotFoundException when car is not in user favorites', async (): Promise<void> => {
      const prismaError = new Error('Record to delete does not exist');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.favorite.delete.mockRejectedValue(prismaError);

      const differentCarId = 'car-456';

      // noinspection ES6RedundantAwait
      await expect(service.delete(mockUserId, differentCarId))
        .rejects
        .toThrow();
    });
  });
});

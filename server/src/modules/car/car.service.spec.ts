import type {PrismaMock} from "@/types";
import type {FindAllCarValidatorType} from "./dto";
import {CarService} from "@/modules/car/car.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {checkConflictRecord, deleteOneFile} from "@/lib";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, NotFoundException} from "@nestjs/common";
import {PaginationValidatorType, PREFIX_PUBLIC_PATH} from "@/common";
import type {Car, Prisma, Comment} from "@/modules/prisma/generated/client";
import {beforeEach, describe, afterEach, it, expect, vi, type Mock} from "vitest";

vi.mock("@/lib", () => ({
  checkConflictRecord: vi.fn(),
  deleteOneFile: vi.fn(),
}));

const mockDate = new Date();
const mockCarWithCategory = {
  id: "car-1",
  created_at: mockDate,
  updated_at: mockDate,
  name: "car",
  slug: "bmw",
  company: "car",
  price_per_day: 200000,
  tags: [
    "car",
    "test"
  ],
  image: "car-1.png",
  can_rent: true,
  category_id: "ef85d0db-e822-4ec9-8009-da7925c965bd",
  description: "a test car",
  rate: 5,
  category: {
    id: "6d17a3c5-fcd8-4667-bf31-66843a9623e6",
    created_at: mockDate,
    updated_at: mockDate,
    name: "test category",
    slug: "test_category",
    description: "test test test",
  },
};

describe('CarService', (): void => {
  let prisma: PrismaMock;
  let service: CarService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CarService(prisma);
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Find One
   *  ================================================
   */
  describe('findOne()', (): void => {
    const mockSlug = mockCarWithCategory.slug;

    // success
    it('should find car by slug and return with category (without creator_id fields)', async () => {
      prisma.car.findUnique.mockResolvedValue({
        ...mockCarWithCategory,
        _count: {
          comments: 12,
          users_favorites: 5,
        }
      } as unknown as Car);

      const result = await service.findOne(mockSlug);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('car');

      const {car} = result.data;
      expect(car.id).toBe(mockCarWithCategory.id);
      expect(car.slug).toBe(mockSlug);
      expect(car).not.toHaveProperty('creator_id');
      expect(car.category).toBeDefined();
      expect(car.category).not.toHaveProperty('creator_id');
      expect(result.data.car._count).toBeDefined();
      expect(result.data.car._count.users_favorites).toBe(5);
      expect(result.data.car._count.comments).toBe(12);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.findUnique).toHaveBeenCalledWith({
        where: {slug: mockSlug},
        include: {
          category: {
            omit: {creator_id: true}
          },
          _count: {
            select: {
              comments: {
                where: {
                  is_confirmed: true
                }
              },
              users_favorites: true,
            }
          }
        },
        omit: {creator_id: true}
      });
    });

    // error: car not found
    it('should throw NotFoundException when car with given slug does not exist', async () => {
      prisma.car.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-slug'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  /** ================================================
   * Find All(get list)
   *  ================================================
   */
  describe('findAll()', (): void => {
    const mockCars = [
      mockCarWithCategory,
      {
        ...mockCarWithCategory,
        id: "car-2",
        image: "car-2.png",
        name: "Benz",
        slug: "benz",
        company: "benz",
        price_per_day: 350000,
        tags: ["electric", "sedan"],
        can_rent: true,
        category_id: "cat-2",
        description: "Electric sedan",
        rate: 4.8,
      }
    ];

    const mockPaginationInput = {
      limit: 10,
      offset: 0,
      can_rent: true,
      category: "suv",
      orderByLower: "asc",
      order_by_field: "price_per_day",
      price_per_day_lte: 500000,
      price_per_day_gte: 100000,
    };

    // success
    it('should return paginated list of cars with filters applied', async () => {
      const mockCarsWithCount = mockCars.map(car => ({
        ...car,
        _count: {
          users_favorites: 3,
          comments: 8
        }
      }));

      prisma.car.count.mockResolvedValue(2);
      prisma.car.findMany.mockResolvedValue(mockCarsWithCount as unknown as Car[]);

      const result = await service.findAll(mockPaginationInput as FindAllCarValidatorType);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('cars');

      // 2. Test message
      expect(result.message).toBe('cars successfully found.');

      // 3. Test count and cars array
      expect(result.data.count).toBe(2);
      expect(Array.isArray(result.data.cars)).toBe(true);
      expect(result.data.cars.length).toBe(2);

      // 4. Test each car doesn't have creator_id
      for (const car of result.data.cars) {
        expect(car).not.toHaveProperty('creator_id');
        expect(car.category).not.toHaveProperty('creator_id');
      }

      for (const car of result.data.cars) {
        expect(car._count).toBeDefined();
        expect(car._count.users_favorites).toBe(3);
        expect(car._count.comments).toBe(8);
      }

      // 5. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.count).toHaveBeenCalledWith({
        where: {
          can_rent: mockPaginationInput.can_rent,
          price_per_day: {
            gte: mockPaginationInput.price_per_day_gte,
            lte: mockPaginationInput.price_per_day_lte,
          },
          category: {
            slug: mockPaginationInput.category,
          }
        }
      });

      // 6. Verify findMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.findMany).toHaveBeenCalledWith({
        include: {
          category: {
            omit: {creator_id: true}
          },
          _count: {
            select: {
              users_favorites: true,
              comments: {
                where: {is_confirmed: true}
              }
            }
          }
        },
        where: {
          can_rent: mockPaginationInput.can_rent,
          price_per_day: {
            gte: mockPaginationInput.price_per_day_gte,
            lte: mockPaginationInput.price_per_day_lte,
          },
          category: {
            slug: mockPaginationInput.category,
          }
        },
        take: mockPaginationInput.limit,
        skip: mockPaginationInput.offset,
        orderBy: {
          [mockPaginationInput.order_by_field]: mockPaginationInput.orderByLower,
        },
        omit: {creator_id: true}
      });
    });

    // success with empty filters
    it('should return all cars when no filters are provided', async () => {
      const emptyFilters = {
        limit: 10,
        offset: 0,
      };

      prisma.car.count.mockResolvedValue(2);
      prisma.car.findMany.mockResolvedValue(mockCars as unknown as Car[]);

      const result = await service.findAll(emptyFilters as FindAllCarValidatorType);

      expect(result.data.count).toBe(2);
      expect(result.data.cars.length).toBe(2);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.count).toHaveBeenCalledWith({
        where: {
          can_rent: undefined,
          price_per_day: {
            gte: undefined,
            lte: undefined,
          },
          category: {
            slug: undefined,
          }
        }
      });
    });
  });

  /** ================================================
   * Create car
   *  ================================================
   */
  describe('create()', (): void => {
    const mockUserId = 'user-123';

    const mockCreateCarInput = {
      name: 'BMW X5',
      slug: 'bmw-x5-2024',
      company: 'BMW',
      price_per_day: 200000,
      tags: ['luxury', 'suv', '2024'],
      description: 'A luxurious BMW X5 for rent',
      can_rent: true,
      category_id: 'cat-456',
      ownership: true,
    };

    const mockCreatedCar = {
      id: 'car-789',
      created_at: mockDate,
      updated_at: mockDate,
      name: 'BMW X5',
      slug: 'bmw-x5-2024',
      company: 'BMW',
      price_per_day: 200000,
      tags: ['luxury', 'suv', '2024'],
      image: null,
      can_rent: true,
      rate: 5,
      description: 'A luxurious BMW X5 for rent',
      category_id: 'cat-456',
      creator_id: mockUserId,
      category: {
        id: 'cat-456',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'SUV',
        slug: 'suv',
        description: 'SUV category',
        creator_id: 'user-789',
      },
    };

    // success
    it('should create a new car successfully with ownership true', async () => {
      prisma.car.create.mockResolvedValue(mockCreatedCar as unknown as Car);

      const result = await service.create(mockUserId, mockCreateCarInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('car');

      // 2. Test success message
      expect(result.message).toBe('Car Successfully created.');

      // 3. Test created car data
      const {car} = result.data;
      expect(car.id).toBe(mockCreatedCar.id);
      expect(car.name).toBe(mockCreateCarInput.name);
      expect(car.slug).toBe(mockCreateCarInput.slug);
      expect(car.company).toBe(mockCreateCarInput.company);
      expect(car.price_per_day).toBe(mockCreateCarInput.price_per_day);
      expect(car.tags).toEqual(mockCreateCarInput.tags);
      expect(car.description).toBe(mockCreateCarInput.description);
      expect(car.can_rent).toBe(mockCreateCarInput.can_rent);
      expect(car.rate).toBe(5);
      expect(car.creator_id).toBe(mockUserId);
      expect(car.category_id).toBe(mockCreateCarInput.category_id);

      // 4. Test category inclusion
      expect(car.category).toBeDefined();
      expect(car.category.id).toBe(mockCreatedCar.category.id);

      // 5. Verify Prisma create call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateCarInput.name,
          slug: mockCreateCarInput.slug,
          tags: mockCreateCarInput.tags,
          company: mockCreateCarInput.company,
          rate: 5,
          can_rent: mockCreateCarInput.can_rent,
          description: mockCreateCarInput.description,
          category_id: mockCreateCarInput.category_id,
          price_per_day: mockCreateCarInput.price_per_day,
          creator_id: mockUserId,
        },
        include: {
          category: true
        }
      });
    });

    // success with ownership false
    it('should create a new car with creator_id = null when ownership is false', async () => {
      const inputWithoutOwnership = {
        ...mockCreateCarInput,
        ownership: false,
      };

      const carWithoutCreator = {
        ...mockCreatedCar,
        creator_id: null,
      };

      prisma.car.create.mockResolvedValue(carWithoutCreator as unknown as Car);

      const result = await service.create(mockUserId, inputWithoutOwnership);

      expect(result.data.car.creator_id).toBeNull();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.create).toHaveBeenCalledWith({
        data: {
          name: inputWithoutOwnership.name,
          slug: inputWithoutOwnership.slug,
          tags: inputWithoutOwnership.tags,
          company: inputWithoutOwnership.company,
          rate: 5,
          can_rent: inputWithoutOwnership.can_rent,
          description: inputWithoutOwnership.description,
          category_id: inputWithoutOwnership.category_id,
          price_per_day: inputWithoutOwnership.price_per_day,
          creator_id: null,
        },
        include: {
          category: true
        }
      });
    });

    // error: duplicate slug
    it('should throw ConflictException when car slug already exists', async () => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2002';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {target: ['slug']};

      prisma.car.create.mockRejectedValue(prismaError);

      await expect(service.create(mockUserId, mockCreateCarInput))
        .rejects
        .toThrow();
    });

    // error: category not found
    it('should throw NotFoundException when category_id does not exist', async () => {
      const prismaError = new Error('Foreign key constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2003';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {field_name: 'category_id'};

      prisma.car.create.mockRejectedValue(prismaError);

      await expect(service.create(mockUserId, mockCreateCarInput))
        .rejects
        .toThrow();
    });
  });

  /** ================================================
   * Update
   * ================================================
   */
  describe('update()', (): void => {
    const mockDate = new Date();

    const mockCarRecord = {
      id: 'car-789',
      created_at: mockDate,
      updated_at: mockDate,
      name: 'BMW X5',
      slug: 'bmw-x5-2024',
      company: 'BMW',
      price_per_day: 200000,
      tags: ['luxury', 'suv'],
      image: null,
      can_rent: true,
      rate: 5,
      description: 'A luxurious BMW X5',
      category_id: 'cat-456',
      creator_id: 'user-123',
      category: {
        id: 'cat-456',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'SUV',
        slug: 'suv',
        description: 'SUV category',
        creator_id: 'user-789',
      },
    };

    const mockUpdateCarInput = {
      name: 'BMW X11',
      slug: 'bmw-x11-2026',
      price_per_day: 250000,
      tags: ['luxury', 'suv', 'sport'],
      description: 'An updated luxurious BMW X11',
      category_id: 'cat-789',
      can_rent: false,
      ownership: false as const,
    };

    const mockUpdatedCar = {
      ...mockCarRecord,
      name: 'BMW X11',
      slug: 'bmw-x11-2026',
      company: 'BMW',
      price_per_day: 250000,
      tags: ['luxury', 'suv', 'sport'],
      description: 'An updated luxurious BMW X11',
      category_id: 'cat-789',
      can_rent: false,
      creator_id: null,
      updated_at: new Date(),
      category: {
        id: 'cat-789',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'Luxury SUV',
        slug: 'luxury-suv',
        description: 'Luxury SUV category',
        creator_id: 'user-789',
      },
    };

    // success
    it('should update car successfully with valid data and ownership false', async () => {
      prisma.car.update.mockResolvedValue(mockUpdatedCar as unknown as Car);

      (checkConflictRecord as Mock).mockResolvedValue({hasConflict: false});

      const result = await service.update(mockCarRecord, mockUpdateCarInput);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('car');
      expect(result.message).toBe('Car Successfully Updated.');

      const {car} = result.data;
      expect(car.id).toBe(mockCarRecord.id);
      expect(car.name).toBe(mockUpdateCarInput.name);
      expect(car.slug).toBe(mockUpdateCarInput.slug);
      expect(car.price_per_day).toBe(mockUpdateCarInput.price_per_day);
      expect(car.tags).toEqual(mockUpdateCarInput.tags);
      expect(car.description).toBe(mockUpdateCarInput.description);
      expect(car.category_id).toBe(mockUpdateCarInput.category_id);
      expect(car.can_rent).toBe(mockUpdateCarInput.can_rent);
      expect(car.creator_id).toBeNull();
      expect(car.category).toBeDefined();
      expect(car.category.id).toBe(mockUpdateCarInput.category_id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.update).toHaveBeenCalledWith({
        where: {id: mockCarRecord.id},
        data: {
          name: mockUpdateCarInput.name,
          slug: mockUpdateCarInput.slug,
          tags: mockUpdateCarInput.tags,
          can_rent: mockUpdateCarInput.can_rent,
          description: mockUpdateCarInput.description,
          category_id: mockUpdateCarInput.category_id,
          price_per_day: mockUpdateCarInput.price_per_day,
          creator_id: null,
        },
        include: {category: true}
      });
    });

    // success: update without changing ownership (creator_id stays undefined)
    it('should keep creator_id unchanged when ownership is not provided', async () => {
      const inputWithoutOwnership = {
        name: 'BMW X6',
        slug: 'bmw-x6-2024',
      };

      const carWithCreator = {
        ...mockUpdatedCar,
        creator_id: 'user-123',
      };

      (checkConflictRecord as Mock).mockResolvedValue({hasConflict: false});

      prisma.car.update.mockResolvedValue(carWithCreator as unknown as Car);

      await service.update(mockCarRecord, inputWithoutOwnership);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.update).toHaveBeenCalledWith({
        where: {id: mockCarRecord.id},
        data: {
          name: inputWithoutOwnership.name,
          slug: inputWithoutOwnership.slug,
          tags: undefined,
          company: undefined,
          description: undefined,
          category_id: undefined,
          price_per_day: undefined,
          creator_id: undefined,
        },
        include: {category: true}
      });
    });

    // error: conflict detection (same data)
    it('should throw ConflictException when new data conflicts with existing record (no changes)', async () => {
      const sameData = {
        name: mockCarRecord.name,
        slug: mockCarRecord.slug,
        company: mockCarRecord.company,
        price_per_day: mockCarRecord.price_per_day,
        tags: mockCarRecord.tags as [string, ...string[]],
        can_rent: mockCarRecord.can_rent,
        ownership: false as const,
      };

      (checkConflictRecord as Mock).mockReturnValue({
        hasConflict: true, conflictData: [
          'name',
          'slug',
          "tags",
          'company',
          "can_rent",
          "price_per_day",
        ]
      });

      await expect(service.update(mockCarRecord, sameData))
        .rejects
        .toThrow(ConflictException);
    });

    // error: duplicate slug
    it('should throw ConflictException when updating to an existing slug', async () => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2002';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {target: ['slug']};

      prisma.car.update.mockRejectedValue(prismaError);

      await expect(service.update(mockCarRecord, mockUpdateCarInput))
        .rejects
        .toThrow();
    });

    // error: category not found
    it('should throw NotFoundException when updating with non-existent category_id', async () => {
      const prismaError = new Error('Foreign key constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2003';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {field_name: 'category_id'};

      prisma.car.update.mockRejectedValue(prismaError);

      await expect(service.update(mockCarRecord, mockUpdateCarInput))
        .rejects
        .toThrow();
    });
  });

  /** ================================================
   * Delete
   * ================================================
   */
  describe("delete", (): void => {
    const mockDate = new Date();
    const mockCarId = 'car-789';

    const mockCarRecord: Car = {
      id: mockCarId,
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
      creator_id: 'user-123',
    };

    // success
    it('should delete car successfully and remove associated image file', async () => {
      prisma.car.delete.mockResolvedValue(mockCarRecord as unknown as Car);

      const result = await service.delete(mockCarId, mockCarRecord);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Car deleted successfully.');

      // 2. Verify Prisma delete call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.delete).toHaveBeenCalledWith({
        where: {id: mockCarId}
      });

      // 3. Verify deleteOneFile was called with correct path
      expect(deleteOneFile).toHaveBeenCalledWith(`${PREFIX_PUBLIC_PATH}/${mockCarRecord.image}`);
    });

    // success: car without image
    it('should delete car successfully even when car has no image', async () => {
      const carWithoutImage = {
        ...mockCarRecord,
        image: null,
      };

      prisma.car.delete.mockResolvedValue(carWithoutImage as unknown as Car);

      const result = await service.delete(mockCarId, carWithoutImage);

      expect(result.message).toBe('Car deleted successfully.');
      expect(deleteOneFile).toHaveBeenCalledWith(`${PREFIX_PUBLIC_PATH}/null`);
    });

    // error: car not found
    it('should throw NotFoundException when car with given id does not exist', async () => {
      const prismaError = new Error('Record to delete does not exist');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';

      prisma.car.delete.mockRejectedValue(prismaError);

      await expect(service.delete(mockCarId, mockCarRecord))
        .rejects
        .toThrow();

      // Verify deleteOneFile was NOT called (car not found)
      expect(deleteOneFile).not.toHaveBeenCalled();
    });

    // error: database error
    it('should propagate Prisma errors through checkPrismaError', async () => {
      const prismaError = new Error('Database connection error');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P1001';

      prisma.car.delete.mockRejectedValue(prismaError);

      await expect(service.delete(mockCarId, mockCarRecord))
        .rejects
        .toThrow();
    });
  });

  /** ================================================
   * Find All Comments
   * ================================================
   */
  describe('findAllComments()', (): void => {
    const mockCarId = 'car-789';
    const mockDate = new Date();

    const mockPaginationInput: PaginationValidatorType = {
      limit: 10,
      offset: 0,
      orderByLower: 'desc',
      page: 1,
      orderByUpper: 'DESC',
    };

    const mockComments = [
      {
        id: 'comment-1',
        content: 'Great car! Very comfortable.',
        created_at: mockDate,
        updated_at: mockDate,
        user_id: 'user-123',
        car_id: mockCarId,
        parent_id: null,
        is_confirmed: true,
        user: {
          id: 'user-123',
          display_name: 'John Doe',
        },
        _count: {
          replies: 2,
        },
      },
      {
        id: 'comment-2',
        content: 'Good value for money.',
        created_at: mockDate,
        updated_at: mockDate,
        user_id: 'user-456',
        car_id: mockCarId,
        parent_id: null,
        is_confirmed: true,
        user: {
          id: 'user-456',
          display_name: 'Jane Smith',
        },
        _count: {
          replies: 0,
        },
      },
    ];

    // success
    it('should return paginated list of confirmed comments for a car', async () => {
      prisma.comment.count.mockResolvedValue(2);
      prisma.comment.findMany.mockResolvedValue(mockComments as unknown as Comment[]);

      const result = await service.findAllComments(mockCarId, mockPaginationInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('comments');

      // 2. Test message
      expect(result.message).toBe('comments find successfully.');

      // 3. Test count and comments array
      expect(result.data.count).toBe(2);
      expect(Array.isArray(result.data.comments)).toBe(true);
      expect(result.data.comments.length).toBe(2);

      // 4. Test comment structure
      const [firstComment] = result.data.comments;
      expect(firstComment.id).toBe(mockComments[0].id);
      expect(firstComment.content).toBe(mockComments[0].content);
      expect(firstComment.is_confirmed).toBe(true);
      expect(firstComment.parent_id).toBeNull();
      expect(firstComment.car_id).toBe(mockCarId);

      // 5. Test user inclusion (only id and display_name)
      expect(firstComment.user).toBeDefined();
      expect(firstComment.user).toHaveProperty('id');
      expect(firstComment.user).toHaveProperty('display_name');
      expect(firstComment.user).not.toHaveProperty('email');
      expect(firstComment.user).not.toHaveProperty('password');

      // 6. Test replies count
      expect(firstComment._count).toBeDefined();
      expect(firstComment._count.replies).toBe(2);

      // 7. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.count).toHaveBeenCalledWith({
        where: {
          car_id: mockCarId,
          parent_id: null,
          is_confirmed: true,
        }
      });

      // 8. Verify findMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          car_id: mockCarId,
          parent_id: null,
          is_confirmed: true,
        },
        take: mockPaginationInput.limit,
        skip: mockPaginationInput.offset,
        orderBy: {
          created_at: mockPaginationInput.orderByLower
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          _count: {
            select: {
              replies: {
                where: {is_confirmed: true}
              }
            }
          }
        }
      });
    });

    // success: empty comments
    it('should return count 0 and empty array when no comments exist for the car', async () => {
      prisma.comment.count.mockResolvedValue(0);
      prisma.comment.findMany.mockResolvedValue([]);

      const result = await service.findAllComments(mockCarId, mockPaginationInput);

      expect(result.data.count).toBe(0);
      expect(result.data.comments).toEqual([]);
      expect(result.message).toBe('comments find successfully.');
    });

    // success: with different pagination values
    it('should apply correct offset based on page and limit', async () => {
      const paginationWithPage2: PaginationValidatorType = {
        limit: 5,
        offset: 5,
        orderByLower: 'asc',
        page: 2,
        orderByUpper: 'ASC',
      };

      prisma.comment.count.mockResolvedValue(3);
      prisma.comment.findMany.mockResolvedValue([mockComments[0]] as unknown as Comment[]);

      await service.findAllComments(mockCarId, paginationWithPage2);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          car_id: mockCarId,
          parent_id: null,
          is_confirmed: true,
        },
        take: 5,
        skip: 5,
        orderBy: {
          created_at: 'asc'
        },
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
            },
          },
          _count: {
            select: {
              replies: {
                where: {is_confirmed: true}
              }
            }
          }
        }
      });
    });

    // edge case: car with no confirmed comments but has unconfirmed ones
    it('should only return confirmed comments (is_confirmed = true)', async () => {
      prisma.comment.count.mockResolvedValue(0);
      prisma.comment.findMany.mockResolvedValue([]);

      const result = await service.findAllComments(mockCarId, mockPaginationInput);

      expect(result.data.count).toBe(0);

      // Verify where clause includes is_confirmed: true
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.comment.count).toHaveBeenCalledWith({
        where: {
          car_id: mockCarId,
          parent_id: null,
          is_confirmed: true,
        }
      });
    });
  });
});

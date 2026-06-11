import type {PrismaMock} from "@/types";
import {NotFoundException} from "@nestjs/common";
import type {FindAllCarValidatorType} from "./dto";
import {CarService} from "@/modules/car/car.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {Car, Prisma} from "@/modules/prisma/generated/client";
import {beforeEach, describe, afterEach, it, expect} from "vitest";

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
  in_rent: false,
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
      prisma.car.findUnique.mockResolvedValue(mockCarWithCategory as unknown as Car);

      const result = await service.findOne(mockSlug);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('car');

      const {car} = result.data;
      expect(car.id).toBe(mockCarWithCategory.id);
      expect(car.slug).toBe(mockSlug);
      expect(car).not.toHaveProperty('creator_id');
      expect(car.category).toBeDefined();
      expect(car.category).not.toHaveProperty('creator_id');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.findUnique).toHaveBeenCalledWith({
        where: {slug: mockSlug},
        include: {
          category: {
            omit: {creator_id: true}
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
        in_rent: true,
        can_rent: true,
        category_id: "cat-2",
        description: "Electric sedan",
        rate: 4.8,
      }
    ];

    const mockPaginationInput = {
      limit: 10,
      offset: 0,
      in_rent: false,
      can_rent: true,
      category: "suv",
      orderByLower: "asc",
      order_by_field: "price_per_day",
      price_per_day_lte: 500000,
      price_per_day_gte: 100000,
    };

    // success
    it('should return paginated list of cars with filters applied', async () => {
      prisma.car.count.mockResolvedValue(2);
      prisma.car.findMany.mockResolvedValue(mockCars as unknown as Car[]);

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

      // 5. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.car.count).toHaveBeenCalledWith({
        where: {
          can_rent: mockPaginationInput.can_rent,
          in_rent: mockPaginationInput.in_rent,
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
          }
        },
        where: {
          can_rent: mockPaginationInput.can_rent,
          in_rent: mockPaginationInput.in_rent,
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
          in_rent: undefined,
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
      in_rent: false,
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
      expect(car.in_rent).toBe(false);
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
          in_rent: false,
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
          in_rent: false,
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
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = { target: ['slug'] };

      prisma.car.create.mockRejectedValue(prismaError);

      await expect(service.create(mockUserId, mockCreateCarInput))
        .rejects
        .toThrow();
    });

    // error: category not found
    it('should throw NotFoundException when category_id does not exist', async () => {
      const prismaError = new Error('Foreign key constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2003';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = { field_name: 'category_id' };

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
      in_rent: false,
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
  });
});
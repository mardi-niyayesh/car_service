import type {PrismaMock} from "@/types";
import {NotFoundException} from "@nestjs/common";
import type {FindAllCarValidatorType} from "./dto";
import {CarService} from "@/modules/car/car.service";
import {Car} from "@/modules/prisma/generated/client";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
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
  });
});
import type {PrismaMock} from "@/types";
import {CarService} from "@/modules/car/car.service";
import {beforeEach, describe, afterEach, it, expect} from "vitest";
import {exampleSafeCarRecord} from "@/modules/car/dto";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Car} from "@/modules/prisma/generated/client";
import {exampleDate} from "@/lib";
import {categoryExampleRes} from "@/modules/category/dto";

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
    const mockSlug = 'bmw';
    const mockDate = new Date();
    const mockCarWithCategory = {
      id: "c8217255-b4b2-4734-a10c-76a1b752693b",
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
      image: "c8217255-b4b2-4734-a10c-76a1b752693b.png",
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
  });
});
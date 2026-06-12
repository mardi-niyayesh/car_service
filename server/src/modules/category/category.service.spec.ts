import type {PrismaMock} from "@/types";
import {NotFoundException} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {Category} from "@/modules/prisma/generated/client";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

describe('CategoryService', (): void => {
  let prisma: PrismaMock;
  let service: CategoryService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CategoryService(prisma);
    prisma.$transaction.mockImplementation(async fn => fn(prisma));
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Find One
   * ================================================
   */
  describe('findOne()', (): void => {
    const mockCategoryId = 'cat-456';
    const mockDate = new Date();

    const mockCategory = {
      id: mockCategoryId,
      created_at: mockDate,
      updated_at: mockDate,
      name: 'SUV',
      slug: 'suv',
      description: 'Sport Utility Vehicle category',
    };

    // success
    it('should find category by id and return without creator_id', async () => {
      prisma.category.findUnique.mockResolvedValue(mockCategory as Category);

      const result = await service.findOne(mockCategoryId);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('category');

      // 2. Test success message
      expect(result.message).toBe('category found successfully.');

      // 3. Test category data
      const {category} = result.data;
      expect(category.id).toBe(mockCategoryId);
      expect(category.name).toBe('SUV');
      expect(category.slug).toBe('suv');
      expect(category.description).toBe('Sport Utility Vehicle category');

      // 4. Test creator_id is omitted
      expect(category).not.toHaveProperty('creator_id');

      // 5. Verify Prisma call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: {id: mockCategoryId},
        omit: {creator_id: true}
      });
    });

    // success: category without description
    it('should return category with null description when description is not provided', async () => {
      const categoryWithoutDesc = {
        ...mockCategory,
        description: null,
      };

      prisma.category.findUnique.mockResolvedValue(categoryWithoutDesc as unknown as Category);

      const result = await service.findOne(mockCategoryId);

      expect(result.data.category.description).toBeNull();
      expect(result.data.category).not.toHaveProperty('creator_id');
    });


    // error: category not found
    it('should throw NotFoundException when category with given id does not exist', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id'))
        .rejects
        .toThrow(NotFoundException);

      await expect(service.findOne('non-existent-id'))
        .rejects
        .toMatchObject({
          response: {
            message: 'Category does not exist in database',
            error: 'Category not found'
          }
        });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: {id: 'non-existent-id'},
        omit: {creator_id: true}
      });
    });

    // error: empty string id
    it('should throw NotFoundException when id is empty string', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne(''))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
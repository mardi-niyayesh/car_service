import type {PrismaMock} from "@/types";
import {NotFoundException} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {type PaginationValidatorType} from "@/common";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import type {Category, Prisma} from "@/modules/prisma/generated/client";

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

  /** ================================================
   * Find All(get list)
   * ================================================
   */
  describe('findAll()', (): void => {
    const mockDate = new Date();

    const mockPaginationInput: PaginationValidatorType = {
      limit: 10,
      offset: 0,
      orderByLower: 'desc',
      page: 1,
      orderByUpper: 'DESC',
    };

    const mockCategories = [
      {
        id: 'cat-1',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'SUV',
        slug: 'suv',
        description: 'Sport Utility Vehicle category',
      },
      {
        id: 'cat-2',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'Sedan',
        slug: 'sedan',
        description: 'Sedan category',
      },
      {
        id: 'cat-3',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'Hatchback',
        slug: 'hatchback',
        description: null,
      },
    ];

    // success
    it('should return paginated list of categories without creator_id', async () => {
      prisma.category.count.mockResolvedValue(3);
      prisma.category.findMany.mockResolvedValue(mockCategories as unknown as Category[]);

      const result = await service.findAll(mockPaginationInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('categories');

      // 2. Test message
      expect(result.message).toBe('categories successfully found.');

      // 3. Test count
      expect(result.data.count).toBe(3);

      // 4. Test categories array
      expect(Array.isArray(result.data.categories)).toBe(true);
      expect(result.data.categories.length).toBe(3);

      // 5. Test each category does NOT have creator_id
      for (const category of result.data.categories) {
        expect(category).not.toHaveProperty('creator_id');
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(category.slug).toBeDefined();
      }

      // 6. Test specific category data
      const [firstCategory] = result.data.categories;
      expect(firstCategory.id).toBe('cat-1');
      expect(firstCategory.name).toBe('SUV');
      expect(firstCategory.slug).toBe('suv');

      // 7. Test category with null description
      const thirdCategory = result.data.categories[2];
      expect(thirdCategory.description).toBeNull();

      // 8. Verify count call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.count).toHaveBeenCalledWith();

      // 9. Verify findMany call with correct params
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: mockPaginationInput.orderByLower
        },
        take: mockPaginationInput.limit,
        skip: mockPaginationInput.offset,
        omit: {creator_id: true}
      });
    });

    // success: empty result
    it('should return count 0 and empty array when no categories exist', async () => {
      prisma.category.count.mockResolvedValue(0);
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.findAll(mockPaginationInput);

      expect(result.data.count).toBe(0);
      expect(result.data.categories).toEqual([]);
      expect(result.message).toBe('categories successfully found.');
    });

    // success: with different pagination values (ascending order)
    it('should respect ascending order when orderByLower is asc', async () => {
      const paginationAsc: PaginationValidatorType = {
        limit: 5,
        offset: 0,
        orderByLower: 'asc',
        page: 1,
        orderByUpper: 'ASC',
      };

      prisma.category.count.mockResolvedValue(2);
      prisma.category.findMany.mockResolvedValue([mockCategories[0]] as unknown as Category[]);

      await service.findAll(paginationAsc);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'asc'
        },
        take: 5,
        skip: 0,
        omit: {creator_id: true}
      });
    });

    // success: with pagination offset (page 2)
    it('should apply correct offset when page is 2', async () => {
      const paginationPage2: PaginationValidatorType = {
        limit: 10,
        offset: 10,
        orderByLower: 'desc',
        page: 2,
        orderByUpper: 'DESC',
      };

      prisma.category.count.mockResolvedValue(15);
      prisma.category.findMany.mockResolvedValue([mockCategories[0]] as unknown as Category[]);

      await service.findAll(paginationPage2);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'desc'
        },
        take: 10,
        skip: 10,
        omit: {creator_id: true}
      });
    });

    // success: large limit
    it('should handle large limit values correctly', async () => {
      const paginationLargeLimit: PaginationValidatorType = {
        limit: 50,
        offset: 0,
        orderByLower: 'desc',
        page: 1,
        orderByUpper: 'DESC',
      };

      prisma.category.count.mockResolvedValue(100);
      prisma.category.findMany.mockResolvedValue(mockCategories as unknown as Category[]);

      await service.findAll(paginationLargeLimit);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'desc'
        },
        take: 50,
        skip: 0,
        omit: {creator_id: true}
      });
    });
  });

  /** ================================================
   * Create
   * ================================================
   */
  describe('create()', (): void => {
    const mockUserId = 'user-123';
    const mockDate = new Date();

    const mockCreateCategoryInput = {
      name: 'Luxury SUV',
      slug: 'luxury-suv',
      description: 'Premium luxury SUV category',
      ownership: true,
    };

    const mockCreatedCategory = {
      id: 'cat-789',
      created_at: mockDate,
      updated_at: mockDate,
      name: 'Luxury SUV',
      slug: 'luxury-suv',
      description: 'Premium luxury SUV category',
      creator_id: mockUserId,
    };

    // success
    it('should create a new category successfully with ownership true', async () => {
      prisma.category.create.mockResolvedValue(mockCreatedCategory as unknown as Category);

      const result = await service.create(mockUserId, mockCreateCategoryInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('category');

      // 2. Test success message
      expect(result.message).toBe('Category successfully created.');

      // 3. Test created category data
      const {category} = result.data;
      expect(category.id).toBe(mockCreatedCategory.id);
      expect(category.name).toBe(mockCreateCategoryInput.name);
      expect(category.slug).toBe(mockCreateCategoryInput.slug);
      expect(category.description).toBe(mockCreateCategoryInput.description);
      expect(category.creator_id).toBe(mockUserId);

      // 4. Verify Prisma create call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          slug: mockCreateCategoryInput.slug,
          name: mockCreateCategoryInput.name,
          description: mockCreateCategoryInput.description,
          creator_id: mockUserId,
        }
      });
    });

    // success: with ownership false
    it('should create a new category with creator_id = null when ownership is false', async () => {
      const inputWithoutOwnership = {
        name: 'Economy',
        slug: 'economy',
        description: 'Budget friendly cars',
        ownership: false,
      };

      const categoryWithoutCreator = {
        id: 'cat-999',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'Economy',
        slug: 'economy',
        description: 'Budget friendly cars',
        creator_id: null,
      };

      prisma.category.create.mockResolvedValue(categoryWithoutCreator as unknown as Category);

      const result = await service.create(mockUserId, inputWithoutOwnership);

      expect(result.data.category.creator_id).toBeNull();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          slug: inputWithoutOwnership.slug,
          name: inputWithoutOwnership.name,
          description: inputWithoutOwnership.description,
          creator_id: null,
        }
      });
    });

    // success: without description (description is optional)
    it('should create a new category without description when not provided', async (): Promise<void> => {
      const inputWithoutDescription = {
        name: 'Sports',
        slug: 'sports',
        ownership: true,
      };

      const categoryWithoutDesc = {
        id: 'cat-111',
        created_at: mockDate,
        updated_at: mockDate,
        name: 'Sports',
        slug: 'sports',
        description: null,
        creator_id: mockUserId,
      };

      prisma.category.create.mockResolvedValue(categoryWithoutDesc as unknown as Category);

      const result = await service.create(mockUserId, inputWithoutDescription);

      expect(result.data.category.description).toBeNull();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          slug: inputWithoutDescription.slug,
          name: inputWithoutDescription.name,
          description: undefined,
          creator_id: mockUserId,
        }
      });
    });

    // error: duplicate name (conflict)
    it('should throw ConflictException when category name already exists', async () => {
      const prismaError = new Error('Unique constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2002';
      (prismaError as Prisma.PrismaClientKnownRequestError).meta = {target: ['name']};

      prisma.category.create.mockRejectedValue(prismaError);

      await expect(service.create(mockUserId, mockCreateCategoryInput))
        .rejects
        .toThrow();

      // Verify create was called but failed
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.category.create).toHaveBeenCalled();
    });
  });
});
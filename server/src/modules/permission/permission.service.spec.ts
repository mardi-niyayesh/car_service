import {describe, beforeEach, afterEach, it, expect} from "vitest";
import {PermissionService} from "./permission.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {Permission} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {PrismaMock} from "@/types";
import {NotFoundException} from "@nestjs/common";

describe('PermissionService', () => {
  let prisma: PrismaMock;
  let service: PermissionService;

  // Mock data
  const mockDate = new Date();

  const mockPermission: Permission = {
    id: 'perm-123',
    name: 'user.view',
    permission_type: 'STANDARD',
    description: 'View user details',
    created_at: mockDate,
    updated_at: mockDate,
  };

  const mockPermission2: Permission = {
    id: 'perm-456',
    name: 'user.edit',
    permission_type: 'STANDARD',
    description: 'Edit user details',
    created_at: mockDate,
    updated_at: mockDate,
  };

  const mockPermission3: Permission = {
    id: 'perm-789',
    name: 'role.create',
    permission_type: 'MANAGER',
    description: 'Create new roles',
    created_at: mockDate,
    updated_at: mockDate,
  };

  const mockPermission4: Permission = {
    id: 'perm-101',
    name: 'owner.all',
    permission_type: 'CORE',
    description: 'Owner all access',
    created_at: mockDate,
    updated_at: mockDate,
  };

  const mockPermissionsList: Permission[] = [
    mockPermission,
    mockPermission2,
    mockPermission3,
  ];

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new PermissionService(prisma);
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Find One
   *  ================================================
   */
  describe('findOne()', (): void => {
    // success
    it('should find a permission by id and return it', async () => {
      prisma.permission.findUnique.mockResolvedValue(mockPermission as unknown as Permission);

      const result = await service.find(mockPermission.id);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('permission');

      // 2. Test success message
      expect(result.message).toBe('permission successfully found');

      // 3. Test permission data
      const {permission} = result.data;
      expect(permission.id).toBe(mockPermission.id);
      expect(permission.name).toBe(mockPermission.name);
      expect(permission.permission_type).toBe(mockPermission.permission_type);
      expect(permission.description).toBe(mockPermission.description);
      expect(permission.created_at).toBe(mockDate);
      expect(permission.updated_at).toBe(mockDate);

      // 4. Verify database call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: {id: mockPermission.id}
      });
    });

    // success: permission with CORE type
    it('should find a permission with CORE type successfully', async () => {
      prisma.permission.findUnique.mockResolvedValue(mockPermission4 as unknown as Permission);

      const result = await service.find(mockPermission4.id);

      expect(result.data.permission.permission_type).toBe('CORE');
      expect(result.data.permission.name).toBe('owner.all');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: {id: mockPermission4.id}
      });
    });

    // error: permission not found
    it('should throw NotFoundException when permission does not exist', async () => {
      prisma.permission.findUnique.mockResolvedValue(null);

      await expect(service.find('non-existent-id'))
        .rejects
        .toThrow(NotFoundException);
      await expect(service.find('non-existent-id'))
        .rejects
        .toThrow('this permission not found in database');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findUnique).toHaveBeenCalledWith({
        where: {id: 'non-existent-id'}
      });
    });

    // error: empty string id
    it('should throw NotFoundException when id is empty string', async () => {
      prisma.permission.findUnique.mockResolvedValue(null);

      await expect(service.find(''))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  /** ================================================
   * Find All
   *  ================================================
   */
  describe('findAll()', (): void => {
    // success: default pagination
    it('should return all permissions with default pagination', async () => {
      prisma.permission.findMany.mockResolvedValue(mockPermissionsList as unknown as Permission[]);
      prisma.permission.count.mockResolvedValue(mockPermissionsList.length);

      const result = await service.findAll({limit: 10, page: 1, orderByLower: 'asc', orderByUpper: 'ASC', offset: 0});

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('count');
      expect(result.data).toHaveProperty('permissions');

      // 2. Test success message
      expect(result.message).toBe('permission successfully found');

      // 3. Test count and permissions length
      expect(result.data.count).toBe(mockPermissionsList.length);
      expect(result.data.permissions.length).toBe(mockPermissionsList.length);

      // 4. Test permissions data
      expect(result.data.permissions[0].id).toBe(mockPermission.id);
      expect(result.data.permissions[1].id).toBe(mockPermission2.id);
      expect(result.data.permissions[2].id).toBe(mockPermission3.id);

      // 5. Verify database calls
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.count).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'asc'
        },
        skip: 0,
        take: 10,
      });
    });

    // success: custom pagination (page 2, limit 5)
    it('should respect custom limit and page parameters', async () => {
      const customLimit = 5;
      const customPage = 2;
      const expectedSkip = (customPage - 1) * customLimit;

      prisma.permission.findMany.mockResolvedValue([mockPermission3] as unknown as Permission[]);
      prisma.permission.count.mockResolvedValue(6);

      const result = await service.findAll({
        limit: customLimit,
        page: customPage,
        orderByLower: 'asc',
        orderByUpper: 'ASC',
        offset: customLimit * (customPage - 1),
      });

      expect(result.data.count).toBe(6);
      expect(result.data.permissions.length).toBe(1);
      expect(result.data.permissions[0].id).toBe(mockPermission3.id);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'asc'
        },
        skip: expectedSkip,
        take: customLimit
      });
    });

    // success: order by name descending
    it('should order permissions by name in descending order', async () => {
      prisma.permission.findMany.mockResolvedValue([mockPermission3, mockPermission2, mockPermission] as unknown as Permission[]);
      prisma.permission.count.mockResolvedValue(3);

      await service.findAll({
        limit: 10,
        page: 1,
        orderByLower: 'desc',
        orderByUpper: 'DESC',
        offset: 0
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        orderBy: {
          created_at: 'desc'
        },
        skip: 0,
        take: 10
      });
    });
  });
});
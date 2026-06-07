import type {PrismaMock} from "@/types";
import {Permission, Prisma, Role} from "@/modules/prisma/generated/client";
import {fakePermissionsTest, fakeRoleTest} from "@/lib";
import {RoleService} from "@/modules/role/role.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {describe, beforeEach, afterEach, it, expect} from "vitest";

describe('RoleService', (): void => {
  let prisma: PrismaMock;
  let service: RoleService;

  // Start All
  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new RoleService(prisma);

    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  // Reset All
  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Find One
   *  ================================================
   */
  describe('findOne()', (): void => {
    // success
    it('should find role and return with permissions', async () => {
      prisma.role.findUnique.mockResolvedValue(fakeRoleTest as unknown as Role);

      const {data: {role}} = await service.findOne({name: 'user_manager'});

      // 1. Test role existence
      expect(role).toBeDefined();

      // 2. Test role main fields
      expect(role.id).toBe(fakeRoleTest.id);
      expect(role.name).toBe('user_manager');
      expect(role.role_type).toBe('SYSTEM');
      expect(role.description).toBe(fakeRoleTest.description);

      // 3. Test permissions existence in output
      expect(role.permissions).toBeDefined();
      expect(Array.isArray(role.permissions)).toBe(true);

      // 4. Test permissions count (should match fakePermissions)
      expect(role.permissions.length).toBe(fakePermissionsTest.length);

      // 5. Test each permission structure (required fields)
      for (const perm of role.permissions) {
        expect(perm).toHaveProperty('id');
        expect(perm).toHaveProperty('name');
        expect(perm).toHaveProperty('permission_type');
        expect(perm).toHaveProperty('description');
      }

      // 6. Test first permission name match
      expect(role.permissions[0].name).toBe('user.view');

      // 7. Test that permission_type is correct
      expect(role.permissions.every(p => p.permission_type === 'MANAGER')).toBe(true);
    });
  });

  /** ================================================
   * Create
   *  ================================================
   */
  describe('create()', (): void => {
    // Mock data
    const mockActionPayload = {
      userId: 'user-123',
      permissions: ['role.create', 'user.view', 'user.edit'],
      roles: ["user_manager", "role_manager"],
    };

    const mockCreateRoleInput = {
      name: 'custom_role_1',
      permissions: ['perm-1', 'perm-2', 'perm-3'],
      description: 'This is a custom role for testing',
      ownership: true
    };

    const newDate = new Date();

    const mockPermissionsRecord: Permission[] = [
      {id: 'perm-1', name: 'user.view', permission_type: 'STANDARD', description: 'View users', created_at: newDate, updated_at: newDate},
      {id: 'perm-2', name: 'user.edit', permission_type: 'STANDARD', description: 'Edit users', created_at: newDate, updated_at: newDate},
      {id: 'perm-3', name: 'role.view', permission_type: 'STANDARD', description: 'View roles', created_at: newDate, updated_at: newDate}
    ];

    const mockCreatedRole: Role = {
      id: 'role-456',
      name: 'custom_role_1',
      description: 'This is a custom role for testing',
      role_type: 'CUSTOM',
      creator_id: 'user-123',
      created_at: newDate,
      updated_at: newDate
    };

    // success
    it('should create a new role successfully with valid permissions', async () => {
      // Mock findMany to return permissions
      prisma.permission.findMany.mockResolvedValue(mockPermissionsRecord as unknown as Permission[]);

      // Mock role.create
      prisma.role.create.mockResolvedValue(mockCreatedRole as unknown as Role);

      const result = await service.create(mockActionPayload, mockCreateRoleInput);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('role');

      // 2. Test success message
      expect(result.message).toBe('role successfully created.');

      // 3. Test created role data
      const {role} = result.data;
      expect(role.id).toBe(mockCreatedRole.id);
      expect(role.name).toBe(mockCreateRoleInput.name);
      expect(role.description).toBe(mockCreateRoleInput.description);
      expect(role.role_type).toBe('CUSTOM');
      expect(role.creator_id).toBe(mockActionPayload.userId);

      // 4. Test permissions inclusion in response
      expect(role.permissions).toBeDefined();
      expect(role.permissions.length).toBe(mockPermissionsRecord.length);

      // 5. Test each permission structure
      for (const perm of role.permissions) {
        expect(perm).toHaveProperty('id');
        expect(perm).toHaveProperty('name');
        expect(perm).toHaveProperty('permission_type');
      }

      // 6. Verify database calls
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        where: {id: {in: mockCreateRoleInput.permissions}}
      });

      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          creator_id: mockActionPayload.userId,
          name: mockCreateRoleInput.name,
          description: mockCreateRoleInput.description,
          role_type: 'CUSTOM'
        }
      });

      expect(prisma.rolePermission.createMany).toHaveBeenCalledWith({
        data: mockCreateRoleInput.permissions.map(p => ({
          role_id: mockCreatedRole.id,
          permission_id: p
        }))
      });
    });
  });
});
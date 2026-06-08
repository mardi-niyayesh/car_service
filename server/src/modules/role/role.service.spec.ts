import {fakePermissionsTest, fakeRoleTest} from "@/lib";
import {RoleService} from "@/modules/role/role.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import type {PrismaMock, RoleIncludeType} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {describe, beforeEach, afterEach, it, expect, vi} from "vitest";
import {Permission, Prisma, Role} from "@/modules/prisma/generated/client";

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
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        where: {id: {in: mockCreateRoleInput.permissions}}
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          creator_id: mockActionPayload.userId,
          name: mockCreateRoleInput.name,
          description: mockCreateRoleInput.description,
          role_type: 'CUSTOM'
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.rolePermission.createMany).toHaveBeenCalledWith({
        data: mockCreateRoleInput.permissions.map(p => ({
          role_id: mockCreatedRole.id,
          permission_id: p
        }))
      });
    });

    // error: permission not found
    it('should throw NotFoundException when one or more permissions do not exist', async () => {
      // Mock findMany to return fewer permissions (missing one)
      const incompletePermissions = mockPermissionsRecord.slice(0, 2);
      prisma.permission.findMany.mockResolvedValue(incompletePermissions as unknown as Permission[]);

      await expect(service.create(mockActionPayload, mockCreateRoleInput))
        .rejects
        .toThrow('One or many Permissions does not exist in database');

      // Verify create and createMany were not called
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.role.create).not.toHaveBeenCalled();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.rolePermission.createMany).not.toHaveBeenCalled();
    });

    // error: base permission
    it('should throw ForbiddenException when trying to create role with base permissions (CORE or OWNER_ALL)', async () => {
      const permissionsWithBase = [
        ...mockPermissionsRecord,
        {id: 'perm-core', name: 'owner.all', permission_type: 'CORE', description: 'Owner all access'}
      ];
      prisma.permission.findMany.mockResolvedValue(permissionsWithBase as unknown as Permission[]);

      await expect(service.create(mockActionPayload, {
        ...mockCreateRoleInput,
        permissions: [...mockCreateRoleInput.permissions, 'perm-core']
      })).rejects.toThrow('you cannot create a new role with base Permissions');

      // Verify create was not called
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.role.create).not.toHaveBeenCalled();
    });

    // error: duplicate role name
    it('should throw conflict error when role name already exists', async () => {
      prisma.permission.findMany.mockResolvedValue(mockPermissionsRecord as unknown as Permission[]);

      // Mock Prisma unique constraint error
      const prismaError = new Error('Unique constraint failed');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2002';
      prisma.role.create.mockRejectedValue(prismaError);

      await expect(service.create(mockActionPayload, mockCreateRoleInput))
        .rejects
        .toThrow();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.rolePermission.createMany).not.toHaveBeenCalled();
    });

    // test without ownership
    it('should create role with creator_id = null when ownership is false', async () => {
      const inputWithoutOwnership = {
        ...mockCreateRoleInput,
        ownership: false
      };

      prisma.permission.findMany.mockResolvedValue(mockPermissionsRecord as unknown as Permission[]);
      prisma.role.create.mockResolvedValue({
        ...mockCreatedRole,
        creator_id: null
      } as Role);

      const result = await service.create(mockActionPayload, inputWithoutOwnership);

      expect(result.data.role.creator_id).toBeNull();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: {
          creator_id: null,
          name: mockCreateRoleInput.name,
          description: mockCreateRoleInput.description,
          role_type: 'CUSTOM'
        }
      });
    });

    it('should call rolePermissionPolicy with correct parameters', async () => {
      prisma.permission.findMany.mockResolvedValue(mockPermissionsRecord as unknown as Permission[]);
      prisma.role.create.mockResolvedValue(mockCreatedRole as unknown as Role);

      const policySpy = vi.spyOn(service, 'rolePermissionPolicy');

      await service.create(mockActionPayload, mockCreateRoleInput);

      expect(policySpy).toHaveBeenCalledWith({
        mode: "create",
        actionPermissions: mockActionPayload.permissions,
        permissions: mockPermissionsRecord
      });

      policySpy.mockRestore();
    });
  });

  /** ================================================
   * Delete
   *  ================================================
   */
  describe('delete()', (): void => {
    // Mock data
    const mockActionPayload = {
      userId: 'user-123',
      permissions: ['owner.all'],
      roles: ['owner'],
    };

    const mockRoleRecord: RoleIncludeType = {
      id: 'role-456',
      name: 'custom_role_1',
      description: 'This is a custom role for testing',
      role_type: 'CUSTOM',
      creator_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      rolePermissions: [
        {
          id: 'rp-1',
          role_id: 'role-456',
          permission_id: 'perm-1',
          created_at: new Date(),
          updated_at: new Date(),
          permission: {
            id: 'perm-1',
            name: 'user.view',
            permission_type: 'MANAGER',
            description: 'View users',
            created_at: new Date(),
            updated_at: new Date()
          }
        }
      ]
    };

    // success
    it('should delete role successfully with valid permissions', async () => {
      prisma.role.delete.mockResolvedValue(mockRoleRecord);

      const result = await service.delete(mockRoleRecord, mockActionPayload);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('role');
      expect(result.message).toBe('role deleted successfully.');
      expect(result.data.role.id).toBe(mockRoleRecord.id);
      expect(result.data.role.name).toBe(mockRoleRecord.name);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.role.delete).toHaveBeenCalledWith({
        where: {id: mockRoleRecord.id}
      });
    });

    // error: permission denied
    it('should throw ForbiddenException when user does not have owner.all permission and role with CORE permissions type', async () => {
      const userWithoutOwner = {
        userId: 'user-456',
        permissions: ['role.view', 'role.delete'],
        roles: ['user_manager'],
      };

      await expect(service.delete(mockRoleRecord, userWithoutOwner))
        .rejects
        .toThrow();
    });

    // error: role not found
    it('should throw NotFoundException when role does not exist in database', async () => {
      const prismaError = new Error('Record to delete does not exist');
      (prismaError as Prisma.PrismaClientKnownRequestError).code = 'P2025';
      prisma.role.delete.mockRejectedValue(prismaError);

      await expect(service.delete(mockRoleRecord, mockActionPayload))
        .rejects
        .toThrow();
    });
  });

  /** ================================================
   * Update
   *  ================================================
   */
  describe('update()', (): void => {
    // Mock data
    const mockActionPayload = {
      userId: 'user-123',
      permissions: ['owner.all', 'role.update'],
      roles: ['owner'],
    };

    const mockUserManagerPayload = {
      userId: 'user-456',
      permissions: ['role.update'],
      roles: ['user_manager'],
    };

    const mockPermissionsRecord: Permission[] = [
      {id: 'perm-1', name: 'user.view', permission_type: 'STANDARD', description: 'View users', created_at: new Date(), updated_at: new Date()},
      {id: 'perm-2', name: 'user.edit', permission_type: 'STANDARD', description: 'Edit users', created_at: new Date(), updated_at: new Date()},
      {id: 'perm-3', name: 'role.view', permission_type: 'STANDARD', description: 'View roles', created_at: new Date(), updated_at: new Date()},
      {id: 'perm-4', name: 'role.delete', permission_type: 'MANAGER', description: 'Delete roles', created_at: new Date(), updated_at: new Date()},
    ];

    const mockRoleRecord: RoleIncludeType = {
      id: 'role-456',
      name: 'custom_role_1',
      description: 'This is a custom role for testing',
      role_type: 'CUSTOM',
      creator_id: 'user-123',
      created_at: new Date(),
      updated_at: new Date(),
      rolePermissions: [
        {
          id: 'rp-1',
          role_id: 'role-456',
          permission_id: 'perm-1',
          created_at: new Date(),
          updated_at: new Date(),
          permission: mockPermissionsRecord[0]
        },
        {
          id: 'rp-2',
          role_id: 'role-456',
          permission_id: 'perm-2',
          created_at: new Date(),
          updated_at: new Date(),
          permission: mockPermissionsRecord[1]
        }
      ]
    };

    const mockSystemRoleRecord: RoleIncludeType = {
      ...mockRoleRecord,
      name: 'admin',
      role_type: 'SYSTEM',
      creator_id: null
    };

    const mockUpdatedRoleRecord: RoleIncludeType = {
      ...mockRoleRecord,
      name: 'updated_role_name',
      description: 'Updated description',
      rolePermissions: [
        ...mockRoleRecord.rolePermissions,
        {
          id: 'rp-3',
          role_id: 'role-456',
          permission_id: 'perm-3',
          created_at: new Date(),
          updated_at: new Date(),
          permission: mockPermissionsRecord[2]
        }
      ]
    };

    const mockRoleAfterDelete: RoleIncludeType = {
      ...mockRoleRecord,
      rolePermissions: mockRoleRecord.rolePermissions.slice(0, 1)
    };

    // success: update name only
    it('should update role name successfully', async () => {
      const updateData = {
        name: 'updated_role_name'
      };

      prisma.role.update.mockResolvedValue({
        ...mockRoleRecord,
        name: updateData.name
      } as unknown as RoleIncludeType);

      const result = await service.update(mockRoleRecord, mockActionPayload, updateData);

      // 1. Test response structure
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('role');

      // 2. Test success message
      expect(result.message).toBe('Role successfully updated.');

      // 3. Test updated role data
      const {role} = result.data;
      expect(role.id).toBe(mockRoleRecord.id);
      expect(role.name).toBe(updateData.name);
      expect(role.description).toBe(mockRoleRecord.description);

      // 4. Verify database call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.role.update).toHaveBeenCalledWith({
        where: {id: mockRoleRecord.id},
        data: {
          name: updateData.name,
          description: undefined,
          creator_id: undefined
        },
        include: {
          rolePermissions: {
            include: {permission: true}
          }
        }
      });
    });

    // success: delete permissions
    it('should delete permissions from role successfully', async () => {
      const updateData = {
        deletePermissions: ['perm-2']
      };

      prisma.rolePermission.deleteMany.mockResolvedValue({count: 1});
      prisma.role.update.mockResolvedValue(mockRoleAfterDelete as unknown as RoleIncludeType);

      const result = await service.update(mockRoleRecord, mockActionPayload, updateData);

      // 1. Test that deleted permission is no longer present
      const remainingPermIds = result.data.role.permissions.map(p => p.id);
      expect(remainingPermIds).not.toContain('perm-2');
      expect(remainingPermIds).toContain('perm-1');

      // 2. Verify deleteMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.rolePermission.deleteMany).toHaveBeenCalledWith({
        where: {
          permission_id: {
            in: updateData.deletePermissions
          },
          role_id: mockRoleRecord.id
        }
      });
    });

    // success: add additional permissions
    it('should add additional permissions to role successfully', async () => {
      const updateData = {
        additionalPermissions: ['perm-3', 'perm-4']
      };

      prisma.permission.findMany.mockResolvedValue([
        mockPermissionsRecord[2],
        mockPermissionsRecord[3]
      ] as unknown as Permission[]);

      const mockRoleAfterAddPermissions: RoleIncludeType = {
        ...mockRoleRecord,
        rolePermissions: [
          ...mockRoleRecord.rolePermissions,
          {
            id: 'rp-3',
            role_id: 'role-456',
            permission_id: 'perm-3',
            created_at: new Date(),
            updated_at: new Date(),
            permission: mockPermissionsRecord[2]
          },
          {
            id: 'rp-4',
            role_id: 'role-456',
            permission_id: 'perm-4',
            created_at: new Date(),
            updated_at: new Date(),
            permission: mockPermissionsRecord[3]
          }
        ]
      };

      prisma.rolePermission.createMany.mockResolvedValue({count: 2});
      prisma.role.update.mockResolvedValue(mockRoleAfterAddPermissions as unknown as RoleIncludeType);

      const result = await service.update(mockRoleRecord, mockActionPayload, updateData);

      // 1. Test that new permissions are added
      const permIds = result.data.role.permissions.map(p => p.id);
      expect(permIds).toContain('perm-1');
      expect(permIds).toContain('perm-2');
      expect(permIds).toContain('perm-3');
      expect(permIds).toContain('perm-4');

      // 2. Verify findMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.permission.findMany).toHaveBeenCalledWith({
        where: {
          id: {in: updateData.additionalPermissions}
        }
      });

      // 3. Verify createMany call
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.rolePermission.createMany).toHaveBeenCalledWith({
        data: updateData.additionalPermissions.map(p => ({
          role_id: mockRoleRecord.id,
          permission_id: p
        }))
      });
    });
  });
});
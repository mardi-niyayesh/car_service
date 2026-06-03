import type {PrismaMock} from "@/types";
import {Role} from "@/modules/prisma/generated/client";
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
});
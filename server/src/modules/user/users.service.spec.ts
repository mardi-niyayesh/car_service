import {exampleDate} from "@/lib";
import {PERMISSIONS, ROLES} from "@/common";
import {UserService} from "./user.service";
import {hashSecret, compareSecret} from "@/lib/utils/crypto";
import {Role, User} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {type DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
import {it, expect, describe, afterEach, beforeEach, vi, type Mock} from "vitest";
import {BadRequestException, ConflictException, ForbiddenException, NotFoundException, UnauthorizedException} from "@nestjs/common";

type PrismaMock = DeepMockProxy<PrismaService>;

vi.mock('@/lib/utils/crypto', () => ({
  hashSecret: vi.fn(),
  compareSecret: vi.fn()
}));

describe("UserService", (): void => {
  let service: UserService;
  let prisma: PrismaMock;

  // Start All
  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new UserService(prisma);

    prisma.$transaction.mockImplementation(async fn => fn(prisma));
  });

  // Reset All
  afterEach((): void => {
    mockReset(prisma);
  });

  // ======================================================
  // Find One Method Tests
  // ======================================================
  describe("findOne()", (): void => {
    // success
    it('should find user and don`t send password: ', async (): Promise<void> => {
      const fakeUser = {
        id: "2a55bda6-e1fc-4047-9725-aeec8fcc9ec4",
        createdAt: exampleDate,
        updatedAt: exampleDate,
        email: "user@example.com",
        password: "example_password",
        display_name: "first user",
        age: 20,
        userRoles: [
          {
            role: {
              name: "self",
              rolePermissions: [
                {
                  permission: {name: "user.self"}
                }
              ]
            }
          },
          {
            role: {
              name: "user_manager",
              rolePermissions: [
                {permission: {name: "role.revoke"}},
                {permission: {name: "role.assign"}},
                {permission: {name: "user.delete"}},
                {permission: {name: "user.view"}}
              ]
            }
          }
        ]
      } as unknown as User;

      prisma.user.findUnique.mockResolvedValue(fakeUser);

      const result = await service.findOne(fakeUser.id);

      expect((result.data.user as unknown as User).password).toBeUndefined();
      expect(result.data.user.email).toBe(fakeUser.email);
      expect(result.data.user.roles).toEqual(["self", "user_manager"]);
      expect(result.data.user.permissions).toEqual([
        "user.self",
        "role.revoke",
        "role.assign",
        "user.delete",
        "user.view"
      ]);
      expect(result.message).toBe("User found successfully");
    });

    // Not Found
    it('if user not exist should to exception: ', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      // noinspection ES6RedundantAwait
      await expect(
        service.findOne("2a55bda6-e1fc-4047-9725-aeec8fcc9ec3")
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ======================================================
  // modifyRole Method Tests
  // ======================================================
  describe("modifyRole()", (): void => {
    const adminPayload = {
      userId: "admin-id",
      roles: [ROLES.USER_MANAGER],
      permissions: [
        PERMISSIONS.ROLE_REVOKE,
        PERMISSIONS.ROLE_ASSIGN,
      ]
    };

    const targetUserId = "target-id";
    const roleId = "role-id";

    // --- Security & Protection Tests ---
    describe("Security Rules", (): void => {
      it("should throw ForbiddenException for self-modification", async (): Promise<void> => {
        prisma.user.findUnique.mockResolvedValue({
          id: adminPayload.userId,
          userRoles: []
        } as unknown as User);

        // noinspection ES6RedundantAwait
        await expect(service.modifyRole({
          actionPayload: adminPayload,
          userId: adminPayload.userId, // self
          rolesId: [roleId],
          action: "assign"
        })).rejects.toThrow(ForbiddenException);
      });
    });

    // --- Logical Validation Tests ---
    describe("Logical Validation", (): void => {
      // ** should throw ConflictException if assigning an existing permission **
      it('should throw ConflictException if assigning an existing permission', async () => {
        prisma.user.findUnique.mockResolvedValue({
          id: targetUserId,
          userRoles: [{
            role: {
              name: "user_manager",
              rolePermissions: [{
                permission: {name: "role.assign"}
              }]
            }
          }]
        } as unknown as User);

        prisma.role.findMany.mockResolvedValue([
          {
            id: roleId,
            name: ROLES.USER_MANAGER,
            created_at: exampleDate,
            updated_at: exampleDate,
            description: "desc",
            rolePermissions: [{
              permission: {name: PERMISSIONS.ROLE_ASSIGN}
            }]
          }
        ] as unknown as Role[]);

        // noinspection ES6RedundantAwait
        await expect(service.modifyRole({
          action: "assign",
          userId: targetUserId,
          rolesId: [roleId],
          actionPayload: adminPayload
        })).rejects.toThrow(ConflictException);
      });

      // ** should throw BadRequestException if revoking a non-assigned role **
      it('should throw BadRequestException if revoking a non-assigned role', async () => {
        prisma.user.findUnique.mockResolvedValue({
          id: targetUserId,
          userRoles: [{
            role: {
              name: "product_manager",
              rolePermissions: [{
                permission: {name: PERMISSIONS.PRODUCT_CREATE}
              }]
            }
          }]
        } as unknown as User);

        prisma.role.findMany.mockResolvedValue([
          {
            id: roleId,
            name: ROLES.CATEGORY_MANAGER,
            created_at: exampleDate,
            updated_at: exampleDate,
            description: "desc",
            rolePermissions: [{
              permission: {name: PERMISSIONS.CATEGORY_CREATE}
            }]
          }
        ] as unknown as Role[]);

        // noinspection ES6RedundantAwait
        await expect(service.modifyRole({
          action: "revoke",
          userId: targetUserId,
          rolesId: [roleId],
          actionPayload: adminPayload
        })).rejects.toThrow(BadRequestException);
      });

      // ** should block modification if target user is an OWNER **
      it('should block modification if target user is an OWNER', async () => {
        prisma.user.findUnique.mockResolvedValue({
          id: targetUserId,
          userRoles: [{
            role: {
              name: ROLES.OWNER,
              rolePermissions: [{
                permission: {name: PERMISSIONS.OWNER_ALL}
              }]
            }
          }]
        } as unknown as User);

        prisma.role.findMany.mockResolvedValue([{
          id: roleId,
          name: "any-role",
          rolePermissions: [{
            permission: {name: PERMISSIONS.ROLE_ASSIGN}
          }]
        }] as unknown as Role[]);

        // noinspection ES6RedundantAwait
        await expect(service.modifyRole({
          action: "assign",
          userId: targetUserId,
          rolesId: [roleId],
          actionPayload: {
            ...adminPayload,
            roles: [ROLES.OWNER]
          }
        })).rejects.toThrow(ForbiddenException);
      });

      // ** should prevent non-owner from assigning management roles **
      it('should prevent non-owner from assigning management roles', async () => {
        prisma.user.findUnique.mockResolvedValue({id: targetUserId, userRoles: []} as unknown as User);

        prisma.role.findMany.mockResolvedValue([{
          id: roleId,
          name: ROLES.ROLE_MANAGER,
          created_at: exampleDate,
          updated_at: exampleDate,
          description: null,
          rolePermissions: [{
            permission: {name: PERMISSIONS.ROLE_CREATE}
          }]
        }] as unknown as Role[]);

        // noinspection ES6RedundantAwait
        await expect(service.modifyRole({
          action: "assign",
          userId: targetUserId,
          rolesId: [roleId],
          actionPayload: {
            ...adminPayload,
            roles: [ROLES.OWNER],
            permissions: [PERMISSIONS.ROLE_ASSIGN]
          }
        })).rejects.toThrow(ForbiddenException);
      });
    });
  });

  // ======================================================
  // Update Password with old password
  // ======================================================
  describe("updatePassword()", (): void => {
    const targetId = 'target-id';

    // ** should throw UnauthorizedException oldPassword !== user password **
    it('should throw UnauthorizedException if oldPassword !== user password', async () => {
      prisma.user.findUnique.mockResolvedValue({id: targetId, password: 'oldPassword'} as unknown as User);

      // noinspection ES6RedundantAwait
      await expect(service.updatePassword(targetId, {
        oldPassword: 'pass', newPassword: 'newPassword',
      })).rejects.toThrow(UnauthorizedException);
    });

    // ** should update password and don't send user information **
    it("should update password and don't send user information", async () => {
      prisma.user.findUnique.mockResolvedValue({id: targetId, password: 'hashedOldPassword'} as unknown as User);

      (compareSecret as Mock).mockResolvedValue(true);
      (hashSecret as Mock).mockResolvedValue('hashedNewPassword');

      const result = await service.updatePassword(targetId, {
        newPassword: 'newPassword',
        oldPassword: 'oldPassword',
      });

      expect(result.message).toBe('User password updated successfully.');
    });
  });
});
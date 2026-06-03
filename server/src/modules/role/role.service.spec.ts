import type {PrismaMock} from "@/types";
import {RoleService} from "@/modules/role/role.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {describe, beforeEach, afterEach, it, expect} from "vitest";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Role} from "@/modules/prisma/generated/client";

const fakeRole = {
  id: "6d64a06a-f1a2-44c1-bd47-e557bd57bcc8",
  name: "user_manager",
  updated_at: "2026-05-06T22:00:43.714Z",
  created_at: "2026-05-06T22:00:43.714Z",
  creator_id: null,
  description: "Full administrative access to manage all users in the system",
  role_type: "SYSTEM",
  rolePermissions: [
    {
      permission_id: "fd000532-1156-4453-ad75-4a69dec40134",
      permission: {
        name: "user.view",
        permission_type: "MANAGER",
        updated_at: "2026-05-06T22:00:43.687Z",
        created_at: "2026-05-06T22:00:43.687Z",
        description: "this permission allows view on user"
      },
    },
  ],
};

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
      prisma.role.findUnique.mockResolvedValue(fakeRole as unknown as Role);

      const {data: {role}} = await service.findOne({name: 'role_manager'});

      expect(role.permissions).toBeDefined();
    });
  });
});
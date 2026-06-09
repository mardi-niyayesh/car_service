import {describe, beforeEach, afterEach} from "vitest";
import {PermissionService} from "./permission.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {Permission} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('PermissionService', () => {
  let prisma: PrismaService;
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
});
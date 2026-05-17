import {JwtService} from "@nestjs/jwt";
import {PERMISSIONS, ROLES} from "@/common";
import {ConfigService} from "@nestjs/config";
import {EventEmitter2} from "@nestjs/event-emitter";
import {Permission, PermissionType, Role, RolePermission, RoleType, User} from "@/modules/prisma/generated/client";
import {AuthService} from "@/modules/auth/auth.service";
import {EmailService} from "@/modules/email/email.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {ConfigMock, NormalizedClientInfo, PrismaMock} from "@/types";
import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
import {exampleDate} from "@/lib";

describe(AuthService.name, (): void => {
  let service: AuthService;
  let prisma: PrismaMock;
  let config: ConfigMock;
  let jwt: DeepMockProxy<JwtService>;
  let email: DeepMockProxy<EmailService>;
  let event: DeepMockProxy<EventEmitter2>;

  // Start Services
  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    config = mockDeep<ConfigService>();
    jwt = mockDeep<JwtService>();
    email = mockDeep<EmailService>();
    event = mockDeep<EventEmitter2>();

    service = new AuthService(
      config,
      prisma,
      jwt,
      email,
      event,
    );

    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  // Reset Services
  afterEach((): void => {
    mockReset(prisma);
    mockReset(config);
    mockReset(email);
    mockReset(jwt);
    mockReset(event);
  });

  // ======================================================
  // Signup
  // ======================================================
  describe("register", () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        age: 18,
        display_name: "new_user",
        password: "new_password",
        email: "new_user@example.com",
      };

      const mockCreatedUser = {
        id: "new_user_uuid",
        email: newUser.email,
        display_name: newUser.display_name,
        age: newUser.age,
        password: "hashed_password",
        created_at: new Date(),
        updated_at: new Date(),
      };

      const clientInfo: NormalizedClientInfo = {
        browser: "firefox",
        city: "city",
        country: "country",
        device: "gigabyte",
        os: "linux",
        lang: "en",
        ip: "188.124.23.122",
      };

      const mockSelfRole: Role = {
        id: "self_role_uuid",
        name: ROLES.SELF,
        updated_at: exampleDate,
        created_at: exampleDate,
        role_type: RoleType.BASE,
        creator_id: null,
        description: "description",
      };

      const mockSelfPermission: Permission = {
        id: "self_permission_uuid",
        name: PERMISSIONS.USER_SELF,
        updated_at: exampleDate,
        created_at: exampleDate,
        description: "description",
        permission_type: PermissionType.CORE,
      };

      const selfRolePermission: RolePermission = {
        role_id: mockSelfRole.id,
        permission_id: mockSelfPermission.id,
        updated_at: exampleDate,
        created_at: exampleDate,
        id: "role_permission_uuid",
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue(mockSelfRole);
      prisma.permission.findUnique.mockResolvedValue(mockSelfPermission);
      prisma.rolePermission.findUnique.mockResolvedValue(selfRolePermission);
      prisma.user.create.mockResolvedValue(mockCreatedUser);
      prisma.userRole.create.mockResolvedValue({
        id: "new_user_role_uuid",
        user_id: mockCreatedUser.id,
        role_id: mockSelfRole.id,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.register(newUser, clientInfo);

      expect(result.data.user.permissions).toEqual([PERMISSIONS.USER_SELF]);
      expect(result.data.user.roles).toEqual([ROLES.SELF]);
      expect((result.data.user as unknown as User).password).toBeUndefined();
    });
  });
});
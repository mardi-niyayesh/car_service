import {exampleDate} from "@/lib";
import {JwtService} from "@nestjs/jwt";
import {PERMISSIONS, ROLES} from "@/common";
import {ConfigService} from "@nestjs/config";
import {EventEmitter2} from "@nestjs/event-emitter";
import {AuthService} from "@/modules/auth/auth.service";
import {EmailService} from "@/modules/email/email.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {ConfigMock, NormalizedClientInfo, PrismaMock} from "@/types";
import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";
import {PermissionType, Role, RoleType, User, UserRole} from "@/modules/prisma/generated/client";

const fakeAuthUser = {
  id: "new_user_uuid",
  email: "new_user@example.com",
  display_name: "new_user",
  age: 18,
  password: "hashed_password",
  created_at: exampleDate,
  updated_at: exampleDate,
  userRoles: [
    {
      role: {
        name: ROLES.SELF,
        rolePermissions: [
          {
            permission: {
              name: PERMISSIONS.USER_SELF
            }
          }
        ]
      }
    }
  ]
} as unknown as User;

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
    const mockSelfRole: Role = {
      id: "self_role_uuid",
      name: ROLES.SELF,
      updated_at: exampleDate,
      created_at: exampleDate,
      role_type: RoleType.BASE,
      creator_id: null,
      description: "description",
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

    it('should successfully create a new user', async () => {
      const mockCreatedUser = {
        id: "new_user_uuid",
        email: fakeAuthUser.email,
        display_name: fakeAuthUser.display_name,
        age: fakeAuthUser.age,
        password: "hashed_password",
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.role.findUnique.mockResolvedValue(mockSelfRole);
      prisma.user.create.mockResolvedValue(mockCreatedUser);
      prisma.userRole.create.mockResolvedValue({
        id: "new_user_role_uuid",
        user_id: mockCreatedUser.id,
        role_id: mockSelfRole.id,
        created_at: new Date(),
        updated_at: new Date(),
        role: {
          id: mockSelfRole.id,
          name: ROLES.SELF,
          created_at: exampleDate,
          updated_at: exampleDate,
          role_type: RoleType.BASE,
          creator_id: null,
          description: "description",
          rolePermissions: [
            {
              id: "rp_uuid",
              role_id: mockSelfRole.id,
              permission_id: "perm_uuid",
              created_at: exampleDate,
              updated_at: exampleDate,
              permission: {
                id: "perm_uuid",
                name: PERMISSIONS.USER_SELF,
                created_at: exampleDate,
                updated_at: exampleDate,
                description: "self permission",
                permission_type: PermissionType.CORE,
              }
            }
          ]
        }
      } as unknown as UserRole);

      const result = await service.register({
        email: fakeAuthUser.email,
        password: fakeAuthUser.password,
        age: fakeAuthUser.age as number,
        display_name: fakeAuthUser.display_name as string,
      }, clientInfo);

      expect(result.data.user.permissions).toEqual([PERMISSIONS.USER_SELF]);
      expect(result.data.user.roles).toEqual([ROLES.SELF]);
      expect((result.data.user as unknown as User).password).toBeUndefined();
    });
  });
});